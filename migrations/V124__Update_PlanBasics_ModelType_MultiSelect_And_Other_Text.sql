ALTER TYPE MODEL_TYPE RENAME TO MODEL_TYPE_OLD;

CREATE TYPE MODEL_TYPE AS ENUM (
  'VOLUNTARY',
  'MANDATORY_REGIONAL_OR_STATE',
  'MANDATORY_NATIONAL',
  'OTHER'
);

-- Temporarily alter the model_type column to TEXT
ALTER TABLE plan_basics
  ALTER COLUMN model_type TYPE zero_string,
  ADD COLUMN model_type_other zero_string;

-- If 'MANDATORY' is selected we want to migrate it to either 'MANDATORY_REGIONAL_OR_STATE' or 'MANDATORY_NATIONAL'
-- As prod data is evenly split, we simply choose one
UPDATE plan_basics
  SET model_type = 'MANDATORY_REGIONAL_OR_STATE',
      modified_by = '00000001-0001-0001-0001-000000000001',
      modified_dts = current_timestamp
  WHERE 'MANDATORY' = model_type;

UPDATE plan_basics
SET model_type = NULL,
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = current_timestamp
WHERE 'TBD' = model_type;

-- Alter the model_type column back to an array of the new MODEL_TYPE enum
ALTER TABLE plan_basics
  ALTER COLUMN model_type TYPE MODEL_TYPE[]
    USING CASE
            WHEN model_type IS NULL THEN ARRAY[]::MODEL_TYPE[]
            ELSE ARRAY[model_type]::MODEL_TYPE[]
    END;

DROP TYPE MODEL_TYPE_OLD;
