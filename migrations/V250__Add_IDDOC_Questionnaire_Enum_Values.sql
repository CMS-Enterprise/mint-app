-- Create enum for IDDOC file types
CREATE TYPE iddoc_file_type AS ENUM (
    'BENEFICIARY',
    'PROVIDER',
    'PART_A',
    'PART_B',
    'OTHER'
);

COMMENT ON TYPE iddoc_file_type IS 'The types of files that can be exchanged in IDDOC';

-- Create enum for IDDOC questionnaire status
CREATE TYPE iddoc_questionnaire_status AS ENUM (
    'NOT_NEEDED',
    'READY',
    'IN_PROGRESS',
    'COMPLETE'
);

COMMENT ON TYPE iddoc_questionnaire_status IS 'Status of the IDDOC questionnaire: NOT_NEEDED (not required), NOT_STARTED (required but not started), IN_PROGRESS (started but not complete), COMPLETED (marked complete)';

-- Add iddoc_questionnaire to the TABLE_NAME enum
ALTER TYPE TABLE_NAME ADD VALUE 'iddoc_questionnaire';
