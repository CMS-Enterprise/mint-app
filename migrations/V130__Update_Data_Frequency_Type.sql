-- Convert columns to TEXT array type
ALTER TABLE plan_ops_eval_and_learning
  ALTER COLUMN data_sharing_frequency TYPE TEXT[] USING data_sharing_frequency::TEXT[],
  ALTER COLUMN data_collection_frequency TYPE TEXT[] USING data_collection_frequency::TEXT[];

-- Set the modified_dts and modified_by in the case where we perform any modifications
UPDATE plan_ops_eval_and_learning
SET
  modified_dts = now(),
  modified_by = '00000001-0001-0001-0001-000000000001'
WHERE
  'BIANNUALLY' = ANY(data_sharing_frequency) OR
  'DAILY' = ANY(data_sharing_frequency) OR
  'WEEKLY' = ANY(data_sharing_frequency) OR
  'SEMI_MONTHLY' = ANY(data_sharing_frequency) OR
  'NOT_PLANNING_TO_DO_THIS' = ANY(data_sharing_frequency) OR
  'BIANNUALLY' = ANY(data_collection_frequency) OR
  'DAILY' = ANY(data_collection_frequency) OR
  'WEEKLY' = ANY(data_collection_frequency) OR
  'SEMI_MONTHLY' = ANY(data_collection_frequency) OR
  'NOT_PLANNING_TO_DO_THIS' = ANY(data_collection_frequency);

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
        END
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
        END
WHERE 'SEMI_MONTHLY' = ANY(data_sharing_frequency) OR 'NOT_PLANNING_TO_DO_THIS' = ANY(data_sharing_frequency);

ALTER TABLE plan_ops_eval_and_learning
  ADD COLUMN data_sharing_frequency_new TEXT[];

-- Append new values to data_sharing_frequency_new based on conditions
UPDATE plan_ops_eval_and_learning
SET data_sharing_frequency_new = array_append(data_sharing_frequency_new, 'CONTINUALLY')
WHERE 'DAILY' = ANY(data_sharing_frequency) OR 'WEEKLY' = ANY(data_sharing_frequency);

UPDATE plan_ops_eval_and_learning
SET data_sharing_frequency_new = array_append(data_sharing_frequency_new, 'OTHER')
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
        END
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
        END
WHERE 'SEMI_MONTHLY' = ANY(data_collection_frequency) OR 'NOT_PLANNING_TO_DO_THIS' = ANY(data_collection_frequency);

ALTER TABLE plan_ops_eval_and_learning
  ADD COLUMN data_collection_frequency_new TEXT[];

-- Append new values to data_collection_frequency_new based on conditions
UPDATE plan_ops_eval_and_learning
  SET data_collection_frequency_new = array_append(data_collection_frequency_new, 'CONTINUALLY')
  WHERE 'DAILY' = ANY(data_collection_frequency) OR 'WEEKLY' = ANY(data_collection_frequency);

UPDATE plan_ops_eval_and_learning
  SET data_collection_frequency_new = array_append(data_collection_frequency_new, 'OTHER')
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
  WHERE val IN ('DAILY', 'WEEKLY'))
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
