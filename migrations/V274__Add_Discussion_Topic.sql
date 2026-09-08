CREATE TYPE DISCUSSION_TOPIC_TYPE AS ENUM (
    'MODEL_PLAN_ALL',
    'MODEL_PLAN_MODEL_BASICS',
    'MODEL_PLAN_GENERAL_CHARACTERISTICS',
    'MODEL_PLAN_PARTICIPANTS_AND_PROVIDERS',
    'MODEL_PLAN_BENEFICIARIES',
    'MODEL_PLAN_OPERATIONS_EVALUATION_AND_LEARNING',
    'MODEL_PLAN_PAYMENT',
    'MODEL_TIMELINE',
    'DATA_EXCHANGE_APPROACH',
    'WAIVER_ASSESSMENT_SURVEY',
    'IDDOC_QUESTIONNAIRE',
    'MODEL_TO_OPERATIONS_MATRIX_MTO',
    'DOCUMENTS',
    'CONTRACTS',
    'FFS_CRS_AND_TDLS',
    'OTHER'
);

ALTER TABLE plan_discussion
ADD COLUMN IF NOT EXISTS topic DISCUSSION_TOPIC_TYPE;

-- backfill
UPDATE plan_discussion
SET
    topic = 'OTHER',
    -- set modified_by for audit table trigger (attempt to use pre-existing modified_by or created_by before defaulting to system user)
    modified_by = COALESCE(modified_by, created_by, '00000001-0001-0001-0001-000000000001'::UUID),
    modified_dts = NOW()
WHERE topic IS NULL;

-- set not null to enforce `topic` selection
ALTER TABLE plan_discussion
ALTER COLUMN topic SET NOT NULL;
