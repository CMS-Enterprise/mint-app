-- Create enum for IDDOC file types
CREATE TYPE iddoc_file_type AS ENUM (
    'BENEFICIARY',
    'PROVIDER',
    'PART_A',
    'PART_B',
    'OTHER'
);

COMMENT ON TYPE iddoc_file_type IS 'The types of files that can be exchanged in IDDOC';

-- Create enum for IDDOC questionnaire work status (does not include NOT_NEEDED)
CREATE TYPE iddoc_questionnaire_status AS ENUM (
    'READY',
    'IN_PROGRESS',
    'COMPLETE'
);

COMMENT ON TYPE iddoc_questionnaire_status IS 'Work completion status for IDDOC questionnaire: READY (not started), IN_PROGRESS (started), COMPLETE (finished). Does not include NOT_NEEDED - that is tracked via the needed field.';

-- Add iddoc_questionnaire to the TABLE_NAME enum
ALTER TYPE TABLE_NAME ADD VALUE 'iddoc_questionnaire';
