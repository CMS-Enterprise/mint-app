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
    created_by,
    modified_by,
    modified_dts
)
SELECT
    GEN_RANDOM_UUID() AS id,
    mp.id AS model_plan_id,
    'READY'::WAIVER_ASSESSMENT_SURVEY_STATUS AS status,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by, -- MINT System Account
    '00000001-0001-0001-0001-000000000001'::UUID AS modified_by, -- MINT System Account
    CURRENT_TIMESTAMP AS modified_dts
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM waiver_assessment_survey was
    WHERE was.model_plan_id = mp.id
);

ALTER TABLE waiver_assessment_survey
ENABLE TRIGGER audit_trigger;
