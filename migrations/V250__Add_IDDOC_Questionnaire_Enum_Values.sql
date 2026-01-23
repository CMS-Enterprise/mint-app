-- Create enum for IDDOC file types
CREATE TYPE iddoc_file_type AS ENUM (
    'BENEFICIARY',
    'PROVIDER',
    'PART_A_CLAIMS',
    'PART_B_CLAIMS',
    'OTHER'
);

COMMENT ON TYPE iddoc_file_type IS 'The types of files that can be exchanged in IDDOC';

-- Create enum for IDDOC load types
CREATE TYPE iddoc_load_type AS ENUM (
    'INITIAL',
    'ONGOING',
    'BOTH'
);

COMMENT ON TYPE iddoc_load_type IS 'How data will be loaded in IDDOC';

-- Add iddoc_questionnaire to the TABLE_NAME enum
ALTER TYPE TABLE_NAME ADD VALUE 'iddoc_questionnaire';
