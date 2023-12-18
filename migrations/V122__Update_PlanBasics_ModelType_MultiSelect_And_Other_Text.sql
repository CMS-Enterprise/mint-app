ALTER TYPE MODEL_TYPE RENAME TO MODEL_TYPE_OLD;

-- Add the 'OTHER' and 'MANDATORY_REGIONAL_OR_STATE' values to the old type so we can migrate 'TBD' and 'MANDATORY'
-- selections later in this migration
ALTER TYPE MODEL_TYPE_OLD ADD VALUE 'OTHER';
ALTER TYPE MODEL_TYPE_OLD ADD VALUE 'MANDATORY_REGIONAL_OR_STATE';


CREATE TYPE MODEL_TYPE AS ENUM (
  'VOLUNTARY',
  'MANDATORY_REGIONAL_OR_STATE',
  'MANDATORY_NATIONAL',
  'OTHER'
);

COMMIT;

ALTER TABLE plan_basics
  ADD COLUMN model_type_other zero_string;

-- If 'TBD' is selected we want to migrate it into the 'OTHER' note field and set our new
-- model type selection to 'OTHER'
UPDATE plan_basics
  SET model_type_other = 'TBD',
      model_type = 'OTHER'
  WHERE 'TBD' = model_type;

-- If 'MANDATORY' is selected we want to migrate it to either 'MANDATORY_REGIONAL_OR_STATE' or 'MANDATORY_NATIONAL'
-- As prod data is evenly split, we simply choose one
UPDATE plan_basics
  SET model_type = 'MANDATORY_REGIONAL_OR_STATE'
  WHERE 'MANDATORY' = model_type;

-- Update the model_type column to use the new MODEL_TYPE values
-- Project the old values into the new
ALTER TABLE plan_basics
  ALTER COLUMN model_type TYPE MODEL_TYPE[]
    using cms_centers::text[]::MODEL_TYPE[];

DROP TYPE MODEL_TYPE_OLD;
