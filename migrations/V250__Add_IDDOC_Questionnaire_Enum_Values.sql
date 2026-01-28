-- Create enum for IDDOC file types
CREATE TYPE iddoc_file_type AS ENUM (
    'BENEFICIARY',
    'PROVIDER',
    'PART_A',
    'PART_B',
    'OTHER'
);

COMMENT ON TYPE iddoc_file_type IS 'The types of files that can be exchanged in IDDOC';

-- Add iddoc_questionnaire to the TABLE_NAME enum
ALTER TYPE TABLE_NAME ADD VALUE 'iddoc_questionnaire';
