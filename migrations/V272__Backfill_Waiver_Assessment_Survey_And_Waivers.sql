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
