-- Trigger function to keep suggested_waiver in sync with waiver_assessment_survey.
-- Uses MERGE (same pattern as SET_SUGGESTED_MTO_MILESTONE in V196) so that rows which
-- remain suggested are left untouched — preserving their change history — while only
-- newly-qualifying rows are inserted and no-longer-qualifying rows are deleted.
--
-- survey_question_field on common_waiver is a column name on waiver_assessment_survey.
-- The trigger uses hstore to look up the field value dynamically, avoiding hardcoded
-- per-field CASE logic. NULL survey_question_field means always suggest.
-- On UPDATE, only common_waiver rows whose mapped field actually changed are processed
-- so that the MERGE is a no-op when unrelated columns are saved.
--
-- TODO: populate common_waiver.survey_question_field once CMS provides real
-- waiver-to-question mappings. Until then the ELSE TRUE branch suggests every waiver.
--
-- TODO: revisit this whole function once the final waiver-to-question configuration is
-- in hand — this is a reasonable starting point but the shape may need to change
-- depending on what that configuration looks like. We'll also want to test more
-- thoroughly once every common_waiver row has a real field mapping (today only one
-- waiver is wired up, for manual/integration testing — see waiver_suggestion_trigger_test.go).
-- Open questions to settle once the config exists:
--   1. Is each waiver suggested by exactly one survey question (1:1), or can a waiver's
--      suggestion depend on multiple fields/questions? If the latter, a single
--      survey_question_field column + hstore lookup won't be enough and this will need
--      a refactor (e.g. a join table mapping a waiver to its trigger fields/conditions).
--   2. Is "is this common_waiver suggested for this survey" logic needed anywhere else
--      (resolvers, reports, etc.)? If so, consider splitting this into a SQL function
--      that just computes/returns suggestion status (a view over the data), with this
--      trigger calling that function to decide what to insert/delete, instead of
--      duplicating the CASE logic wherever it's needed.
--   3. Would it be simpler to split the INSERT and UPDATE handling into two separate
--      triggers/functions (or push the initial seed onto app code) instead of one
--      function branching on TG_OP? The MERGE itself doesn't need an INSERT-specific
--      branch — it's only there so every common_waiver gets evaluated on first seed.
CREATE OR REPLACE FUNCTION MANAGE_SUGGESTED_WAIVERS()
RETURNS TRIGGER AS $body$
DECLARE
    actor        UUID;
    h_new        HSTORE;
    h_old        HSTORE;
    changed_keys TEXT[];
BEGIN
    actor = COALESCE(NEW.modified_by, NEW.created_by);
    h_new = hstore(NEW.*);

    IF TG_OP = 'INSERT' THEN
        -- Treat all fields as changed so every common_waiver is evaluated on initial seed
        changed_keys = '{*}'::TEXT[];
    ELSE
        h_old = hstore(OLD.*);
        changed_keys = akeys(h_new - h_old);
    END IF;

    MERGE INTO suggested_waiver AS target
    USING (
        SELECT
            cw.id AS common_waiver_id,
            CASE
                WHEN cw.survey_question_field IS NULL THEN TRUE
                -- Dynamically look up the field value by name; NULL answer means still suggest
                -- TODO: this assumes a waiver is only suggested when its mapped field is
                -- TRUE. If some waivers should instead be suggested on FALSE (or some
                -- other value), survey_question_field alone won't be enough — we'd need
                -- an extra column on common_waiver (e.g. the expected/target value) to
                -- compare against instead of hardcoding TRUE here.
                ELSE COALESCE((h_new -> cw.survey_question_field)::BOOLEAN, TRUE)
            END AS suggested
        FROM common_waiver cw
        -- On UPDATE: skip waivers whose mapped field did not change (no-op optimization)
        WHERE cw.survey_question_field IS NULL
           OR changed_keys = '{*}'::TEXT[]
           OR cw.survey_question_field = ANY(changed_keys)
    ) AS source
    ON target.model_plan_id = NEW.model_plan_id
       AND target.common_waiver_id = source.common_waiver_id

    WHEN MATCHED AND COALESCE(source.suggested, FALSE) <> TRUE THEN
        DELETE

    WHEN NOT MATCHED AND source.suggested = TRUE THEN
        INSERT (id, model_plan_id, common_waiver_id, created_by)
        VALUES (GEN_RANDOM_UUID(), NEW.model_plan_id, source.common_waiver_id, actor);

    RETURN NULL;
END;
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION MANAGE_SUGGESTED_WAIVERS IS
'Keeps suggested_waiver in sync with waiver_assessment_survey via MERGE.
Inserts newly-suggested waivers and deletes disqualified ones without touching
rows that remain suggested, preserving their audit history.
Uses hstore to resolve survey_question_field values dynamically; on UPDATE only
processes common_waiver rows whose mapped field actually changed.';

CREATE TRIGGER seed_suggested_waivers
AFTER INSERT ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();

CREATE TRIGGER recalculate_suggested_waivers
AFTER UPDATE ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();
