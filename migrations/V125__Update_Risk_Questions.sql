-- Rename the existing enum type
ALTER TYPE participant_risk_type RENAME TO participant_risk_type_old;

-- Create the new enum type
CREATE TYPE participant_risk_type AS ENUM (
  'TWO_SIDED', 'ONE_SIDED', 'CAPITATION', 'OTHER', 'NOT_RISK_BASED'
  );

-- Temporarily alter the risk_type column to an array of zero_string
ALTER TABLE plan_participants_and_providers
  ALTER COLUMN risk_type TYPE zero_string[]
    USING CASE
            WHEN participant_assume_risk = TRUE THEN ARRAY[risk_type::zero_string]
            ELSE ARRAY['NOT_RISK_BASED']
    END;

-- Change the type of risk_type back to an array of participant_risk_type
ALTER TABLE plan_participants_and_providers
  ALTER COLUMN risk_type TYPE participant_risk_type[]
    USING risk_type::text[]::participant_risk_type[];

-- Drop the old enum type
DROP TYPE participant_risk_type_old;

-- Drop the participant_assume_risk column
ALTER TABLE plan_participants_and_providers
  DROP COLUMN participant_assume_risk;
