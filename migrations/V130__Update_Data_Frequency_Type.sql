-- Convert columns to TEXT array type
ALTER TABLE plan_ops_eval_and_learning
  ALTER COLUMN data_sharing_frequency TYPE TEXT[] USING data_sharing_frequency::TEXT[],
  ALTER COLUMN data_collection_frequency TYPE TEXT[] USING data_collection_frequency::TEXT[];

-- Alter plan_ops_eval_and_learning.data_sharing_frequency to use this new type
UPDATE plan_ops_eval_and_learning
SET data_sharing_frequency_continually =
      CASE
        WHEN data_sharing_frequency_continually IS NOT NULL AND data_sharing_frequency_continually <> '' THEN
          data_sharing_frequency_continually || ', ' || (
            SELECT string_agg(CASE
                                WHEN val = 'DAILY' THEN 'Daily'
                                WHEN val = 'WEEKLY' THEN 'Weekly'
                                END, ', ')
            FROM unnest(data_sharing_frequency) AS val
            WHERE val IN ('DAILY', 'WEEKLY')
          ) ELSE (
            SELECT string_agg(CASE
                                WHEN val = 'DAILY' THEN 'Daily'
                                WHEN val = 'WEEKLY' THEN 'Weekly'
                                END, ', ')
            FROM unnest(data_sharing_frequency) AS val
            WHERE val IN ('DAILY', 'WEEKLY'))
        END,
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
WHERE 'DAILY' = ANY(data_sharing_frequency) OR 'WEEKLY' = ANY(data_sharing_frequency);

UPDATE plan_ops_eval_and_learning
SET data_sharing_frequency_other =
      CASE
        WHEN data_sharing_frequency_other IS NOT NULL AND data_sharing_frequency_other <> '' THEN
          data_sharing_frequency_other || ', ' || (
            SELECT string_agg(CASE
                                WHEN val = 'SEMI_MONTHLY' THEN 'Semi-monthly'
                                WHEN val = 'NOT_PLANNING_TO_DO_THIS' THEN 'Not planning to do this'
                                END, ', ')
            FROM unnest(data_sharing_frequency) AS val
            WHERE val IN ('SEMI_MONTHLY', 'NOT_PLANNING_TO_DO_THIS')
          )
        ELSE
          (
            SELECT string_agg(CASE
                                WHEN val = 'SEMI_MONTHLY' THEN 'Semi-monthly'
                                WHEN val = 'NOT_PLANNING_TO_DO_THIS' THEN 'Not planning to do this'
                                END, ', ')
            FROM unnest(data_sharing_frequency) AS val
            WHERE val IN ('SEMI_MONTHLY', 'NOT_PLANNING_TO_DO_THIS')
          )
        END,
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
WHERE 'SEMI_MONTHLY' = ANY(data_sharing_frequency) OR 'NOT_PLANNING_TO_DO_THIS' = ANY(data_sharing_frequency);

ALTER TABLE plan_ops_eval_and_learning
  ADD COLUMN data_sharing_frequency_new TEXT[];

-- Append new values to data_sharing_frequency_new based on conditions
UPDATE plan_ops_eval_and_learning
SET data_sharing_frequency_new = array_append(data_sharing_frequency_new, 'CONTINUALLY'),
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
WHERE 'DAILY' = ANY(data_sharing_frequency) OR 'WEEKLY' = ANY(data_sharing_frequency);

UPDATE plan_ops_eval_and_learning
SET data_sharing_frequency_new = array_append(data_sharing_frequency_new, 'OTHER'),
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
WHERE 'SEMI_MONTHLY' = ANY(data_sharing_frequency) OR 'NOT_PLANNING_TO_DO_THIS' = ANY(data_sharing_frequency);

-- Drop old column and rename the new one
ALTER TABLE plan_ops_eval_and_learning
  DROP COLUMN data_sharing_frequency;

ALTER TABLE plan_ops_eval_and_learning
  RENAME COLUMN data_sharing_frequency_new TO data_sharing_frequency;

-- Alter plan_ops_eval_and_learning.data_collection_frequency to use this new type
UPDATE plan_ops_eval_and_learning
SET data_collection_frequency_continually =
      CASE
        WHEN data_collection_frequency_continually IS NOT NULL AND data_collection_frequency_continually <> '' THEN
          data_collection_frequency_continually || ', ' || (
            SELECT string_agg(CASE
                                WHEN val = 'DAILY' THEN 'Daily'
                                WHEN val = 'WEEKLY' THEN 'Weekly'
                                END, ', ')
            FROM unnest(data_collection_frequency) AS val
            WHERE val IN ('DAILY', 'WEEKLY')
          )
        ELSE
          (
            SELECT string_agg(CASE
                                WHEN val = 'DAILY' THEN 'Daily'
                                WHEN val = 'WEEKLY' THEN 'Weekly'
                                END, ', ')
            FROM unnest(data_collection_frequency) AS val
            WHERE val IN ('DAILY', 'WEEKLY')
          )
        END,
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
WHERE 'DAILY' = ANY(data_collection_frequency) OR 'WEEKLY' = ANY(data_collection_frequency);

UPDATE plan_ops_eval_and_learning
SET data_collection_frequency_other =
      CASE
        WHEN data_collection_frequency_other IS NOT NULL AND data_collection_frequency_other <> '' THEN
          data_collection_frequency_other || ', ' || (
            SELECT string_agg(CASE
                                WHEN val = 'SEMI_MONTHLY' THEN 'Semi-monthly'
                                WHEN val = 'NOT_PLANNING_TO_DO_THIS' THEN 'Not planning to do this'
                                END, ', ')
            FROM unnest(data_collection_frequency) AS val
            WHERE val IN ('SEMI_MONTHLY', 'NOT_PLANNING_TO_DO_THIS')
          )
        ELSE
          (
            SELECT string_agg(CASE
                                WHEN val = 'SEMI_MONTHLY' THEN 'Semi-monthly'
                                WHEN val = 'NOT_PLANNING_TO_DO_THIS' THEN 'Not planning to do this'
                                END, ', ')
            FROM unnest(data_collection_frequency) AS val
            WHERE val IN ('SEMI_MONTHLY', 'NOT_PLANNING_TO_DO_THIS')
          )
        END,
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
WHERE 'SEMI_MONTHLY' = ANY(data_collection_frequency) OR 'NOT_PLANNING_TO_DO_THIS' = ANY(data_collection_frequency);

ALTER TABLE plan_ops_eval_and_learning
  ADD COLUMN data_collection_frequency_new TEXT[];

-- Append new values to data_collection_frequency_new based on conditions
UPDATE plan_ops_eval_and_learning
  SET data_collection_frequency_new = array_append(data_collection_frequency_new, 'CONTINUALLY'),
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
  WHERE 'DAILY' = ANY(data_collection_frequency) OR 'WEEKLY' = ANY(data_collection_frequency);

UPDATE plan_ops_eval_and_learning
  SET data_collection_frequency_new = array_append(data_collection_frequency_new, 'OTHER'),
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
  WHERE 'SEMI_MONTHLY' = ANY(data_collection_frequency) OR 'NOT_PLANNING_TO_DO_THIS' = ANY(data_collection_frequency);

-- Drop old column and rename the new one
ALTER TABLE plan_ops_eval_and_learning
  DROP COLUMN data_collection_frequency;

ALTER TABLE plan_ops_eval_and_learning
  RENAME COLUMN data_collection_frequency_new TO data_collection_frequency;

-- Alter plan_ops_eval_and_learning data_sharing_frequency and data_collection_frequency to use the common
UPDATE plan_ops_eval_and_learning
SET data_collection_frequency = ARRAY(
  SELECT CASE
           WHEN val = 'BIANNUALLY' THEN 'SEMIANNUALLY'
           WHEN val IN ('DAILY', 'WEEKLY') THEN 'CONTINUALLY'
           WHEN val IN ('SEMI_MONTHLY', 'NOT_PLANNING_TO_DO_THIS') THEN 'OTHER'
           ELSE val
           END
  FROM unnest(data_collection_frequency) AS val
  WHERE val IN ('DAILY', 'WEEKLY')),
  modified_by = '00000001-0001-0001-0001-000000000001',
  modified_dts = now()
WHERE 'BIANNUALLY' = ANY(data_collection_frequency) OR
  'DAILY' = ANY(data_collection_frequency) OR
  'WEEKLY' = ANY(data_collection_frequency) OR
  'SEMI_MONTHLY' = ANY(data_collection_frequency) OR
  'NOT_PLANNING_TO_DO_THIS' = ANY(data_collection_frequency);

-- Alter plan_ops_eval_and_learning data_sharing_frequency and data_collection_frequency to use the common
-- frequency_type enum
ALTER TABLE plan_ops_eval_and_learning
  ALTER COLUMN data_sharing_frequency TYPE FREQUENCY_TYPE[]
    USING CASE
            WHEN data_sharing_frequency IS NULL THEN NULL
            ELSE data_sharing_frequency::FREQUENCY_TYPE[]
    END;

ALTER TABLE plan_ops_eval_and_learning
  ALTER COLUMN data_collection_frequency TYPE FREQUENCY_TYPE[]
    USING CASE
            WHEN data_collection_frequency IS NULL THEN NULL
            ELSE data_collection_frequency::FREQUENCY_TYPE[]
    END;

--
-- Update plan_beneficiaries to use the array type where needed
--

-- Rename old beneficiary_selection_frequency to beneficiary_selection_frequency_old
ALTER TABLE plan_beneficiaries
  RENAME COLUMN beneficiary_selection_frequency TO beneficiary_selection_frequency_old;

-- Create a new beneficiary_selection_frequency column with the new type
ALTER TABLE plan_beneficiaries
  ADD COLUMN beneficiary_selection_frequency TYPE FREQUENCY_TYPE[];

-- Update the values for already existing rows
UPDATE plan_beneficiaries
SET beneficiary_selection_frequency = ARRAY[beneficiary_selection_frequency_old]
WHERE beneficiary_selection_frequency_old IS NOT NULL;

-- Delete the old data
ALTER TABLE plan_beneficiaries
  DROP COLUMN beneficiary_selection_frequency_old;

--
-- Update plan_participants_and_providers to use the array type where needed
--

-- Rename old provider_addition_frequency to provider_addition_frequency_old
ALTER TABLE plan_participants_and_providers
  RENAME COLUMN provider_addition_frequency TO provider_addition_frequency_old;

-- Create a new provider_addition_frequency column with the new type
ALTER TABLE plan_participants_and_providers
  ADD COLUMN provider_addition_frequency TYPE FREQUENCY_TYPE[];

-- Update the values for already existing rows
UPDATE plan_participants_and_providers
SET provider_addition_frequency = ARRAY[provider_addition_frequency_old]
WHERE provider_addition_frequency_old IS NOT NULL;

-- Delete the old data
ALTER TABLE plan_participants_and_providers
  DROP COLUMN provider_addition_frequency_old;
