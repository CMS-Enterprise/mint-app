-- V260: Add mto_suggested_milestone_reason table to store per-field reasons for milestone suggestions
-- This replaces the simple boolean isSuggested with a richer type that captures which
-- specific table/column/value combination triggered each suggestion.

-- 1. Create an enum type for the tables that can trigger milestone suggestions
CREATE TYPE mto_milestone_suggestion_reason_table AS ENUM (
    'iddoc_questionnaire',
    'plan_basics',
    'plan_beneficiaries',
    'plan_general_characteristics',
    'plan_ops_eval_and_learning',
    'plan_participants_and_providers',
    'plan_payments'
);

COMMENT ON TYPE mto_milestone_suggestion_reason_table IS
'Enum of database tables that can trigger MTO milestone suggestions via the SET_SUGGESTED_MTO_MILESTONE trigger';

-- 2. Create the reasons table
CREATE TABLE mto_suggested_milestone_reason (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mto_suggested_milestone_id UUID NOT NULL
    REFERENCES mto_suggested_milestone(id) ON DELETE CASCADE,
    trigger_table MTO_MILESTONE_SUGGESTION_REASON_TABLE NOT NULL,
    trigger_col   TEXT NOT NULL,   -- individual column name (e.g. 'manage_part_c_d_enrollment')
    trigger_val   TEXT NOT NULL,   -- the specific value that matched (e.g. 't', 'LOI')

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE,

    UNIQUE (mto_suggested_milestone_id, trigger_col, trigger_val)
);

COMMENT ON TABLE mto_suggested_milestone_reason IS
'Stores the specific per-field reasons why a milestone was suggested for a model plan.
Each row represents one (field, value) pair that matched a trigger condition.
Rows are managed by the SET_SUGGESTED_MTO_MILESTONE trigger.';

COMMENT ON COLUMN mto_suggested_milestone_reason.trigger_col IS
'The individual column name in trigger_table that contributed to this suggestion (e.g. manage_part_c_d_enrollment)';

COMMENT ON COLUMN mto_suggested_milestone_reason.trigger_val IS
'The specific value of trigger_col that matched the trigger condition (e.g. t, LOI, APPLICATION_REVIEW_AND_SCORING_TOOL)';

-- 3. New function: DETERMINE_MTO_MILESTONE_SUGGESTION_REASONS
-- Returns one row per (milestone, trigger_col, trigger_val) that matched.
-- If a milestone has any rows returned, it is suggested (suggested = TRUE).
-- If no rows, it is not suggested.
CREATE FUNCTION determine_mto_milestone_suggestion_reasons(
    p_table_name TEXT,
    p_model_plan_id UUID,
    h_new HSTORE,
    p_changed_keys TEXT[] DEFAULT '{*}'::TEXT[]
)
RETURNS TABLE (
    mto_common_milestone_id UUID,
    trigger_table           TEXT,
    trigger_col             TEXT,
    trigger_val             TEXT,
    model_plan_id           UUID
)
AS $$
BEGIN
    RETURN QUERY
    WITH SuggestionConditions AS (
        -- Find all common milestones that reference this trigger table and have relevant changed keys
        SELECT
            mto_common_milestone.id         AS mto_common_milestone_id,
            mto_common_milestone.trigger_col AS trigger_cols,
            mto_common_milestone.trigger_vals
        FROM public.mto_common_milestone
        WHERE mto_common_milestone.trigger_table = p_table_name
          AND (
              (p_changed_keys && mto_common_milestone.trigger_col)
              OR p_changed_keys = '{*}'::TEXT[]
          )
    ),
    -- Expand each trigger_col array to individual column names
    ExpandedCols AS (
        SELECT
            sc.mto_common_milestone_id,
            sc.trigger_vals,
            unnest(sc.trigger_cols) AS col_name
        FROM SuggestionConditions sc
    ),
    -- Fetch the raw hstore value for each individual column
    ColValues AS (
        SELECT
            ec.mto_common_milestone_id,
            ec.trigger_vals,
            ec.col_name,
            (h_new -> ec.col_name) AS raw_val
        FROM ExpandedCols ec
    ),
    -- For scalar (non-array) values, keep as-is
    ScalarValues AS (
        SELECT
            cv.mto_common_milestone_id,
            cv.trigger_vals,
            cv.col_name,
            cv.raw_val AS val
        FROM ColValues cv
        WHERE cv.raw_val IS NOT NULL
          AND cv.raw_val <> 'NULL'
          AND NOT starts_with(cv.raw_val, '{')
    ),
    -- For array-encoded values (e.g. '{LOI,NOFO}'), unnest each element individually
    ArrayValues AS (
        SELECT
            cv.mto_common_milestone_id,
            cv.trigger_vals,
            cv.col_name,
            unnest(cv.raw_val::TEXT[]) AS val
        FROM ColValues cv
        WHERE cv.raw_val IS NOT NULL
          AND cv.raw_val <> 'NULL'
          AND starts_with(cv.raw_val, '{')
    ),
    -- Combine scalar and array values
    UnnestedValues AS (
        SELECT * FROM ScalarValues
        UNION ALL
        SELECT * FROM ArrayValues
    ),
    -- Keep only values that match a trigger value
    MatchingReasons AS (
        SELECT
            uv.mto_common_milestone_id,
            p_table_name                    AS trigger_table,
            uv.col_name                     AS trigger_col,
            uv.val                          AS trigger_val,
            p_model_plan_id                 AS model_plan_id
        FROM UnnestedValues uv
        WHERE ARRAY[uv.val] && uv.trigger_vals
    )
    SELECT DISTINCT * FROM MatchingReasons;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION determine_mto_milestone_suggestion_reasons IS
'Returns one row per (mto_common_milestone_id, trigger_col, trigger_val) that matches the current state
of the given table row (h_new hstore). Each returned row represents one per-field reason why a milestone
is suggested. If no rows are returned for a milestone, it is not suggested.
This is a fine-grained companion to DETERMINE_MTO_MILESTONE_SUGGESTIONS.';


-- 4. Replace SET_SUGGESTED_MTO_MILESTONE to also manage reasons
CREATE OR REPLACE FUNCTION public.SET_SUGGESTED_MTO_MILESTONE() RETURNS TRIGGER AS $body$
DECLARE
    h_old          hstore;
    h_new          hstore;
    modified_by_id UUID;
    plan_id        UUID;
    h_changed      HSTORE;
    changedKeys    text[];
BEGIN
    IF TG_WHEN <> 'AFTER' OR TG_OP <> 'UPDATE' THEN
        RAISE EXCEPTION 'public.SET_SUGGESTED_MTO_MILESTONE() may only run AS an AFTER trigger for UPDATE statements';
    END IF;

    h_new          = hstore(NEW.*);
    h_old          = hstore(OLD.*);
    h_changed      = (h_new - h_old);
    changedKeys    = akeys(h_changed);
    modified_by_id = h_new -> 'modified_by';
    plan_id        = h_new -> 'model_plan_id';

    -- Early exit: if nothing actually changed, there is nothing to update.
    -- Without this guard the DELETE below would wipe all reasons for this
    -- trigger_table + plan while the INSERT would add nothing back.
    IF array_length(changedKeys, 1) IS NULL THEN
        RETURN NULL;
    END IF;

    -- Step 1: Get per-field reasons for the current row state.
    -- Use '{*}' (full row scan) so multi-column milestones are evaluated against ALL
    -- trigger columns, not just the ones that changed. This prevents incorrectly
    -- removing a suggestion when only one of several trigger columns changes.
    WITH Reasons AS (
        SELECT *
        FROM DETERMINE_MTO_MILESTONE_SUGGESTION_REASONS(
            TG_TABLE_NAME::text, plan_id, h_new, '{*}'::TEXT[]
        )
    ),
    -- Aggregate: milestones that now have at least one reason are suggested
    SuggestedMilestones AS (
        SELECT
            mto_common_milestone_id,
            model_plan_id,
            TRUE AS suggested
        FROM Reasons
        GROUP BY mto_common_milestone_id, model_plan_id
    ),
    -- All milestones affected by this trigger table + changed keys (may now have 0 reasons)
    AffectedMilestones AS (
        SELECT DISTINCT
            mto_common_milestone.id AS mto_common_milestone_id,
            plan_id                 AS model_plan_id
        FROM public.mto_common_milestone
        WHERE mto_common_milestone.trigger_table = TG_TABLE_NAME::text
          AND (
              (changedKeys && mto_common_milestone.trigger_col)
              OR changedKeys = '{*}'::TEXT[]
          )
    ),
    -- Step 2: MERGE mto_suggested_milestone
    -- Combine affected milestones with their new suggestion state
    AllMilestoneUpdates AS (
        SELECT
            am.mto_common_milestone_id,
            am.model_plan_id,
            COALESCE(sm.suggested, FALSE) AS suggested
        FROM AffectedMilestones am
        LEFT JOIN SuggestedMilestones sm
            ON sm.mto_common_milestone_id = am.mto_common_milestone_id
    )
    MERGE INTO mto_suggested_milestone AS target
    USING AllMilestoneUpdates AS source
    ON  target.mto_common_milestone_id = source.mto_common_milestone_id
    AND target.model_plan_id           = source.model_plan_id
    WHEN MATCHED AND source.suggested = FALSE THEN
        DELETE
    WHEN NOT MATCHED AND source.suggested = TRUE THEN
        INSERT (id, mto_common_milestone_id, model_plan_id, created_by)
        VALUES (gen_random_uuid(), source.mto_common_milestone_id, source.model_plan_id, modified_by_id);

    -- Step 3: Refresh reasons for this trigger table + model plan.
    -- Delete ALL stale reasons for this table, then re-derive from the full current row
    -- state ('{*}'). Using the full row scan on both DELETE and INSERT ensures the two
    -- operations are symmetric: no reason is left behind and no duplicate is inserted.
    DELETE FROM mto_suggested_milestone_reason r
    USING mto_suggested_milestone s,
          public.mto_common_milestone cm
    WHERE r.mto_suggested_milestone_id = s.id
      AND s.mto_common_milestone_id    = cm.id
      AND s.model_plan_id              = plan_id
      AND r.trigger_table              = TG_TABLE_NAME::mto_milestone_suggestion_reason_table
      AND cm.trigger_table             = TG_TABLE_NAME::text;

    -- Insert updated reasons derived from the full current row state.
    INSERT INTO mto_suggested_milestone_reason (
        id,
        mto_suggested_milestone_id,
        trigger_table,
        trigger_col,
        trigger_val,
        created_by
    )
    SELECT
        gen_random_uuid(),
        s.id,
        TG_TABLE_NAME::mto_milestone_suggestion_reason_table,
        r.trigger_col,
        r.trigger_val,
        modified_by_id
    FROM DETERMINE_MTO_MILESTONE_SUGGESTION_REASONS(
             TG_TABLE_NAME::text, plan_id, h_new, '{*}'::TEXT[]
         ) r
    JOIN mto_suggested_milestone s
        ON  s.mto_common_milestone_id = r.mto_common_milestone_id
        AND s.model_plan_id           = r.model_plan_id;

    RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION set_suggested_mto_milestone IS
'This trigger calls DETERMINE_MTO_MILESTONE_SUGGESTION_REASONS to determine if a milestone should be
suggested based on changes in a task list table. It maintains both mto_suggested_milestone (presence of
suggestion) and mto_suggested_milestone_reason (per-field reasons why it was suggested).';


-- 5. Backfill reasons for all existing mto_suggested_milestone records
-- Uses DETERMINE_MTO_MILESTONE_SUGGESTION_REASONS across all trigger tables for each model plan
INSERT INTO mto_suggested_milestone_reason (
    id,
    mto_suggested_milestone_id,
    trigger_table,
    trigger_col,
    trigger_val,
    created_by
)
SELECT
    gen_random_uuid()                          AS id,
    s.id                                       AS mto_suggested_milestone_id,
    r.trigger_table::MTO_MILESTONE_SUGGESTION_REASON_TABLE,
    r.trigger_col,
    r.trigger_val,
    '00000001-0001-0001-0001-000000000001' AS created_by
FROM mto_suggested_milestone s
JOIN LATERAL (
    SELECT * FROM
        determine_mto_milestone_suggestion_reasons(
            'plan_basics',
            s.model_plan_id,
            (SELECT hstore(t.*) FROM plan_basics t WHERE t.model_plan_id = s.model_plan_id),
            '{*}'::TEXT[]
        )
    WHERE mto_common_milestone_id = s.mto_common_milestone_id

    UNION ALL

    SELECT * FROM
        determine_mto_milestone_suggestion_reasons(
            'plan_beneficiaries',
            s.model_plan_id,
            (SELECT hstore(t.*) FROM plan_beneficiaries t WHERE t.model_plan_id = s.model_plan_id),
            '{*}'::TEXT[]
        )
    WHERE mto_common_milestone_id = s.mto_common_milestone_id

    UNION ALL

    SELECT * FROM
        determine_mto_milestone_suggestion_reasons(
            'plan_general_characteristics',
            s.model_plan_id,
            (SELECT hstore(t.*) FROM plan_general_characteristics t WHERE t.model_plan_id = s.model_plan_id),
            '{*}'::TEXT[]
        )
    WHERE mto_common_milestone_id = s.mto_common_milestone_id

    UNION ALL

    SELECT * FROM
        determine_mto_milestone_suggestion_reasons(
            'plan_ops_eval_and_learning',
            s.model_plan_id,
            (SELECT hstore(t.*) FROM plan_ops_eval_and_learning t WHERE t.model_plan_id = s.model_plan_id),
            '{*}'::TEXT[]
        )
    WHERE mto_common_milestone_id = s.mto_common_milestone_id

    UNION ALL

    SELECT * FROM
        determine_mto_milestone_suggestion_reasons(
            'plan_participants_and_providers',
            s.model_plan_id,
            (SELECT hstore(t.*) FROM plan_participants_and_providers t WHERE t.model_plan_id = s.model_plan_id),
            '{*}'::TEXT[]
        )
    WHERE mto_common_milestone_id = s.mto_common_milestone_id

    UNION ALL

    SELECT * FROM
        determine_mto_milestone_suggestion_reasons(
            'plan_payments',
            s.model_plan_id,
            (SELECT hstore(t.*) FROM plan_payments t WHERE t.model_plan_id = s.model_plan_id),
            '{*}'::TEXT[]
        )
    WHERE mto_common_milestone_id = s.mto_common_milestone_id

    UNION ALL

    SELECT * FROM
        determine_mto_milestone_suggestion_reasons(
            'iddoc_questionnaire',
            s.model_plan_id,
            (SELECT hstore(t.*) FROM iddoc_questionnaire t WHERE t.model_plan_id = s.model_plan_id),
            '{*}'::TEXT[]
        )
    WHERE mto_common_milestone_id = s.mto_common_milestone_id
) r ON TRUE;

-- 6. Attach the SET_SUGGESTED_MTO_MILESTONE trigger to iddoc_questionnaire
-- (no mto_common_milestone rows currently reference this table, but the
--  infrastructure is in place for future milestone triggers on IDDOC fields)
SELECT public.ADD_MTO_SUGGESTED_MILESTONE_SUGGESTION_TRIGGER('public', 'iddoc_questionnaire');
