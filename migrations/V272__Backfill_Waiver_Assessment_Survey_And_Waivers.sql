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

-- Part 3: DB triggers to manage suggested_waiver automatically going forward.
-- On INSERT into waiver_assessment_survey (new model plan): seed all common waivers as
-- suggested because no survey answers exist yet (all fields NULL).
-- On UPDATE: delete existing suggestions and re-insert based on current answers.
-- survey_question_field is NULL on all common_waiver rows until real mappings arrive via
-- a future migration, so the ELSE TRUE branch suggests every waiver unconditionally.
CREATE OR REPLACE FUNCTION MANAGE_SUGGESTED_WAIVERS()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        DELETE FROM suggested_waiver WHERE model_plan_id = NEW.model_plan_id;
    END IF;

    INSERT INTO suggested_waiver (id, model_plan_id, common_waiver_id, created_by)
    SELECT
        GEN_RANDOM_UUID(),
        NEW.model_plan_id,
        cw.id,
        COALESCE(NEW.modified_by, NEW.created_by)
    FROM common_waiver cw
    WHERE (
        cw.survey_question_field IS NULL
        OR CASE cw.survey_question_field
            -- TODO: populate common_waiver.survey_question_field once CMS provides
            -- real waiver-to-question mappings.
            -- Example: Medicare payment waiver triggered by page-3 question
            WHEN 'modifies_medicare_savings_programs'
                THEN NEW.modifies_medicare_savings_programs IS NULL OR NEW.modifies_medicare_savings_programs
            -- Example: Program/Medicare BE waiver triggered by page-4 question
            WHEN 'impacts_site_of_care_payments'
                THEN NEW.impacts_site_of_care_payments IS NULL OR NEW.impacts_site_of_care_payments
            -- Example: Medicaid payment waiver triggered by page-5 question
            WHEN 'impacts_medicaid_only_beneficiaries'
                THEN NEW.impacts_medicaid_only_beneficiaries IS NULL OR NEW.impacts_medicaid_only_beneficiaries
            ELSE TRUE
        END
    )
    ON CONFLICT (model_plan_id, common_waiver_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER seed_suggested_waivers
AFTER INSERT ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();

CREATE TRIGGER recalculate_suggested_waivers
AFTER UPDATE ON waiver_assessment_survey
FOR EACH ROW EXECUTE FUNCTION MANAGE_SUGGESTED_WAIVERS();
