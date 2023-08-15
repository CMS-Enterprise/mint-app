BEGIN;
  ALTER TYPE MODEL_CATEGORY ADD VALUE 'TO_BE_DETERMINED';
COMMIT;

-- Set fields we will be removing to 'TO_BE_DETERMINED'
UPDATE plan_basics
SET model_category = 'TO_BE_DETERMINED'
WHERE
    model_category = 'DEMONSTRATION'
    OR model_category = 'EPISODE_BASED_PAYMENT_INITIATIVES'
    OR model_category = 'INIT_MEDICAID_CHIP_POP'
    OR model_category = 'INIT__MEDICARE_MEDICAID_ENROLLEES'
    OR model_category = 'INIT_ACCEL_DEV_AND_TEST'
    OR model_category = 'INIT_SPEED_ADOPT_BEST_PRACTICE'
    OR model_category = 'PRIMARY_CARE_TRANSFORMATION'
    OR model_category = 'UNKNOWN';

-- Create a new enum type with only the values we want
CREATE TYPE MODEL_CATEGORY_NEW AS ENUM (
    'ACCOUNTABLE_CARE',
    'DISEASE_SPECIFIC_AND_EPISODIC',
    'HEALTH_PLAN',
    'PRESCRIPTION_DRUG',
    'STATE_BASED',
    'STATUTORY',
    'TO_BE_DETERMINED'
);

-- Reassign the model_category column type from the old enum to the new one
ALTER TABLE plan_basics
ALTER COLUMN model_category TYPE MODEL_CATEGORY_NEW
USING model_category::TEXT::MODEL_CATEGORY_NEW;

-- Drop the old enum and rename the new one to the old name
DROP TYPE MODEL_CATEGORY;
ALTER TYPE MODEL_CATEGORY_NEW RENAME TO MODEL_CATEGORY;


-- Add the additional_categories column
ALTER TABLE plan_basics ADD COLUMN additional_model_categories MODEL_CATEGORY[];
