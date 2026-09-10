ALTER TYPE PLAN_TASK_KEY ADD VALUE IF NOT EXISTS 'WAIVER_ASSESSMENT_SURVEY';

/*
Backfill a WAIVER_ASSESSMENT_SURVEY plan_task row for every existing model plan.
All existing plans start at TO_DO since no survey data exists yet.
*/
INSERT INTO plan_task (
    id,
    model_plan_id,
    key,
    status,
    created_by
)
SELECT
    GEN_RANDOM_UUID() AS task_id,
    mp.id,
    'WAIVER_ASSESSMENT_SURVEY'::PLAN_TASK_KEY,
    'TO_DO'::PLAN_TASK_STATUS,
    '00000001-0001-0001-0001-000000000001'::UUID
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task pt
    WHERE
        pt.model_plan_id = mp.id
        AND pt.key = 'WAIVER_ASSESSMENT_SURVEY'::PLAN_TASK_KEY
);


-- Add the waiver tables to the TABLE_NAME enum used by auditing
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'waiver_assessment_survey';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'waiver';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'common_waiver';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'suggested_waiver';

-- Create enum for waiver assessment survey work status
CREATE TYPE WAIVER_ASSESSMENT_SURVEY_STATUS AS ENUM (
    'READY',
    'IN_PROGRESS',
    'COMPLETE'
);

COMMENT ON TYPE WAIVER_ASSESSMENT_SURVEY_STATUS IS 'Work completion status for waiver assessment survey: READY (not started), IN_PROGRESS (started), COMPLETE (finished).';

-- Create enum for not selected reason on waiver questions
CREATE TYPE NOT_SELECTED_REASON AS ENUM (
    'OUT_OF_SCOPE',
    'OVERLAPS',
    'NOT_TESTING',
    'NOT_ENGAGED',
    'FEEDBACK_AGAINST_USE',
    'OTHER'
);

COMMENT ON TYPE NOT_SELECTED_REASON IS 'Reason for selecting no on a waiver question.';

-- Create the waiver_assessment_survey table
CREATE TABLE waiver_assessment_survey (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),

    -- Page 3 - Medicare payment waivers
    modifies_medicare_savings_programs BOOLEAN,
    modifies_medicare_savings_programs_example TEXT,
    modifies_medicare_savings_programs_why_not NOT_SELECTED_REASON,
    bundles_payments BOOLEAN,
    bundles_payments_example TEXT,
    bundles_payments_why_not NOT_SELECTED_REASON,
    offers_risk_sharing_arrangements BOOLEAN,
    offers_risk_sharing_arrangements_example TEXT,
    offers_risk_sharing_arrangements_why_not NOT_SELECTED_REASON,

    -- Page 4 - Program waivers (Medicare Benefit Enhancements)
    impacts_site_of_care_payments BOOLEAN,
    impacts_site_of_care_payments_example TEXT,
    impacts_site_of_care_payments_why_not NOT_SELECTED_REASON,
    modifies_care_team_scope_of_practice BOOLEAN,
    modifies_care_team_scope_of_practice_example TEXT,
    modifies_care_team_scope_of_practice_why_not NOT_SELECTED_REASON,
    modifies_care_delivery_with_claims_based_payments BOOLEAN,
    modifies_care_delivery_with_claims_based_payments_example TEXT,
    modifies_care_delivery_with_claims_based_payments_why_not NOT_SELECTED_REASON,
    modifies_quality_measurements_or_payments_via_waivers BOOLEAN,
    modifies_quality_measurements_or_payments_via_waivers_example TEXT,
    modifies_quality_measurements_or_payments_via_waivers_why_not NOT_SELECTED_REASON,

    -- Page 5 - Medicaid payment waivers
    impacts_medicaid_only_beneficiaries BOOLEAN,
    impacts_medicaid_only_beneficiaries_example TEXT,
    impacts_medicaid_only_beneficiaries_why_not NOT_SELECTED_REASON,
    impacts_home_community_based_service_payments BOOLEAN,
    impacts_home_community_based_service_payments_example TEXT,
    impacts_home_community_based_service_payments_why_not NOT_SELECTED_REASON,
    impacts_managed_care_waivers BOOLEAN,
    impacts_managed_care_waivers_example TEXT,
    impacts_managed_care_waivers_why_not NOT_SELECTED_REASON,
    additional_medicaid_specific_waivers TEXT,

    status WAIVER_ASSESSMENT_SURVEY_STATUS NOT NULL DEFAULT 'READY',
    completed_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    completed_dts TIMESTAMP WITH TIME ZONE,

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- Only one waiver assessment survey per model plan
    UNIQUE(model_plan_id)
);

COMMENT ON TABLE waiver_assessment_survey IS 'Waiver assessment survey for a model plan. Tracks whether and how the model affects various Medicare and Medicaid waivers.';
COMMENT ON COLUMN waiver_assessment_survey.completed_by IS 'The user who marked the waiver assessment survey complete.';
COMMENT ON COLUMN waiver_assessment_survey.completed_dts IS 'The timestamp when the waiver assessment survey was marked complete.';

-- Create the common_waiver table
CREATE TABLE common_waiver (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    name TEXT NOT NULL,
    description TEXT,
    participation_agreement_language_link TEXT,
    cmmi_waiver_point_of_contact TEXT,
    waiver_type TEXT,
    waiver_focus TEXT,
    what_is_waived TEXT,
    has_standardization_effort BOOLEAN,
    has_claims_data_or_rreg_analysis TEXT,
    is_used_in_active_models BOOLEAN,
    survey_question_field TEXT,

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE common_waiver IS 'Library of CMMI waivers that can be associated with model plans.';

-- Create the waiver table
CREATE TABLE waiver (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    common_waiver_id UUID NOT NULL REFERENCES common_waiver(id),
    will_use_waiver BOOLEAN,
    not_using_reason TEXT,

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- A model plan can only have one row per common waiver
    UNIQUE(model_plan_id, common_waiver_id)
);

COMMENT ON TABLE waiver IS 'A model plan''s decision on whether to use a specific common waiver.';

-- Create the suggested_waiver table
CREATE TABLE suggested_waiver (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    common_waiver_id UUID NOT NULL REFERENCES common_waiver(id),

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- A model plan can only have one suggested row per common waiver
    UNIQUE(model_plan_id, common_waiver_id)
);

COMMENT ON TABLE suggested_waiver IS 'Waivers MINT has determined are likely needed for a model plan based on waiver assessment survey answers.';

-- Seed fake common_waiver data (5 per waiver type, 15 total)
INSERT INTO common_waiver (
    id,
    name,
    description,
    participation_agreement_language_link,
    cmmi_waiver_point_of_contact,
    waiver_type,
    waiver_focus,
    what_is_waived,
    has_standardization_effort,
    has_claims_data_or_rreg_analysis,
    is_used_in_active_models,
    created_by
)
VALUES
(
    '9f955945-7afd-481f-8558-e7e0fd465463'::UUID,
    'Medicare Payment Waiver 1',
    'Allows for model participants to enter into agreements with Medicare-enrolled providers and suppliers to participate as Preferred Providers under MSSP.',
    'https://cms.gov/',
    '',
    'Lorem Ipsum',
    'Administrative and operational',
    '42 CFR § 425.114(a) and (b)',
    FALSE,
    'Lorem ipsum',
    TRUE,
    '00000001-0001-0001-0001-000000000001'::UUID
),
(GEN_RANDOM_UUID(), 'Medicare Payment Waiver 2', NULL, NULL, NULL, 'MEDICARE_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicare Payment Waiver 3', NULL, NULL, NULL, 'MEDICARE_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicare Payment Waiver 4', NULL, NULL, NULL, 'MEDICARE_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicare Payment Waiver 5', NULL, NULL, NULL, 'MEDICARE_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 1', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BE', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 2', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BE', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 3', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BE', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 4', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BE', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 5', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BE', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 1', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 2', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 3', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 4', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 5', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID);

-- Add waiver assessment survey completion notification activity type.
-- Must be separate from V269 because ALTER TYPE ADD VALUE cannot be referenced
-- as a literal in the same transaction.
ALTER TYPE ACTIVITY_TYPE ADD VALUE IF NOT EXISTS 'WAIVER_ASSESSMENT_SURVEY_MARKED_COMPLETE' AFTER 'IDDOC_QUESTIONNAIRE_COMPLETED';

-- Notification preference type scoping waiver survey completion alerts.
CREATE TYPE WAIVER_ASSESSMENT_SURVEY_MARKED_COMPLETE_NOTIFICATION_TYPE AS ENUM (
    'ALL_MODELS',
    'FOLLOWED_MODELS',
    'MY_MODELS'
);

ALTER TABLE user_notification_preferences
ADD COLUMN waiver_assessment_survey_marked_complete USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT '{}'::USER_NOTIFICATION_PREFERENCE_FLAG[],
ADD COLUMN waiver_assessment_survey_marked_complete_notification_type WAIVER_ASSESSMENT_SURVEY_MARKED_COMPLETE_NOTIFICATION_TYPE DEFAULT NULL;

COMMENT ON COLUMN user_notification_preferences.waiver_assessment_survey_marked_complete IS 'Notification preference for when a waiver assessment survey is marked complete.';
COMMENT ON COLUMN user_notification_preferences.waiver_assessment_survey_marked_complete_notification_type IS 'Notification preference type for when a waiver assessment survey is marked complete.';

-- Register auditing for the waiver_assessment_survey and waiver tables.
-- These calls must run in a separate migration from the ALTER TYPE TABLE_NAME ADD VALUE
-- statements (V269) because PostgreSQL does not allow a newly added enum value to be
-- referenced as a literal in the same transaction.
SELECT audit.AUDIT_TABLE(
    'public',
    'waiver_assessment_survey',
    'id',
    'model_plan_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,model_plan_id}'::TEXT[]
);

SELECT audit.AUDIT_TABLE(
    'public',
    'waiver',
    'id',
    'model_plan_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,model_plan_id,common_waiver_id}'::TEXT[]
);

SELECT audit.AUDIT_TABLE(
    'public',
    'suggested_waiver',
    'id',
    'model_plan_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,model_plan_id,common_waiver_id}'::TEXT[]
);

-- Part 1: Backfill waiver_assessment_survey for every model plan that doesn't already have one
ALTER TABLE waiver_assessment_survey
DISABLE TRIGGER audit_trigger;

INSERT INTO waiver_assessment_survey (
    id,
    model_plan_id,
    status,
    created_by
)
SELECT
    GEN_RANDOM_UUID() AS id,
    mp.id AS model_plan_id,
    'READY'::WAIVER_ASSESSMENT_SURVEY_STATUS AS status,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by -- MINT System Account
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM waiver_assessment_survey was
    WHERE was.model_plan_id = mp.id
);

ALTER TABLE waiver_assessment_survey
ENABLE TRIGGER audit_trigger;

-- Part 2: Seed suggested_waiver rows — suggest all common waivers for every model plan.
-- survey_question_field is NULL on all common_waiver rows until real mappings arrive,
-- so the INSERT logic suggests every waiver for every plan.
ALTER TABLE suggested_waiver
DISABLE TRIGGER audit_trigger;

INSERT INTO suggested_waiver (
    id,
    model_plan_id,
    common_waiver_id,
    created_by
)
SELECT
    GEN_RANDOM_UUID() AS id,
    mp.id AS model_plan_id,
    cw.id AS common_waiver_id,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by -- MINT System Account
FROM model_plan mp
CROSS JOIN common_waiver cw
WHERE NOT EXISTS (
    SELECT 1 FROM suggested_waiver sw
    WHERE
        sw.model_plan_id = mp.id
        AND sw.common_waiver_id = cw.id
);

ALTER TABLE suggested_waiver
ENABLE TRIGGER audit_trigger;

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
