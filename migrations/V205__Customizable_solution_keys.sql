-- Step 1: Rename the column
ALTER TABLE user_view_customization
RENAME COLUMN possible_operational_solutions TO solutions;

-- Step 2: Remove disallowed values
-- (Keep only values that are valid in the new type)
UPDATE user_view_customization
SET solutions = ARRAY(
    SELECT UNNEST(solutions)
    EXCEPT
    SELECT UNNEST(ARRAY[
        'INTERNAL_STAFF',
        'EXISTING_CMS_DATA_AND_PROCESS',
        'OTHER_NEW_PROCESS',
        'CONTRACTOR',
        'CROSS_MODEL_CONTRACT'
    ]::OPERATIONAL_SOLUTION_KEY[])
);

-- Step 3: Change the column type
-- First, drop default to allow ALTER TYPE
ALTER TABLE user_view_customization
ALTER COLUMN solutions DROP DEFAULT;

-- Then cast the array elements to the new enum type
ALTER TABLE user_view_customization
ALTER COLUMN solutions
TYPE MTO_COMMON_SOLUTION_KEY[]
USING solutions::TEXT[]::MTO_COMMON_SOLUTION_KEY[];

-- Finally, re-add the default (empty array of the new type)
ALTER TABLE user_view_customization
ALTER COLUMN solutions SET DEFAULT '{}'::MTO_COMMON_SOLUTION_KEY[];


COMMENT ON COLUMN user_view_customization.solutions IS 'This column represents a list of Solution Keys that the user has selected to view. This selection is used when the user has also selected MODELS_BY_SOLUTION as a view type.';

-- Rename the value to be more generic as the data is no longer called an operational solution
ALTER TYPE view_customization_type
RENAME VALUE 'MODELS_BY_OPERATIONAL_SOLUTION' TO 'MODELS_BY_SOLUTION';
