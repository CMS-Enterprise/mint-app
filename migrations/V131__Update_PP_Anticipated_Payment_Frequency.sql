-- Convert columns to TEXT array type
ALTER TABLE plan_payments
  ALTER COLUMN anticipated_payment_frequency TYPE TEXT[] USING anticipated_payment_frequency::TEXT[];

-- Set the modified_dts and modified_by in the case where we perform any modifications
UPDATE plan_payments
SET
  modified_dts = now(),
  modified_by = '00000001-0001-0001-0001-000000000001'
WHERE 'DAILY' = ANY(anticipated_payment_frequency) OR
  'WEEKLY' = ANY(anticipated_payment_frequency) OR
  'SEMIMONTHLY' = ANY(anticipated_payment_frequency);

-- Alter plan_ops_eval_and_learning.data_sharing_frequency to use this new type
UPDATE plan_payments
SET anticipated_payment_frequency_continually =
      CASE
        WHEN anticipated_payment_frequency_continually IS NOT NULL AND anticipated_payment_frequency_continually <> '' THEN
          anticipated_payment_frequency_continually || ', ' || (
            SELECT string_agg(CASE
                                WHEN val = 'DAILY' THEN 'Daily'
                                WHEN val = 'WEEKLY' THEN 'Weekly'
                                END, ', ')
            FROM unnest(anticipated_payment_frequency) AS val
            WHERE val IN ('DAILY', 'WEEKLY')
          )
        ELSE
          (
            SELECT string_agg(CASE
                                WHEN val = 'DAILY' THEN 'Daily'
                                WHEN val = 'WEEKLY' THEN 'Weekly'
                                END, ', ')
            FROM unnest(anticipated_payment_frequency) AS val
            WHERE val IN ('DAILY', 'WEEKLY')
          )
        END
WHERE 'DAILY' = ANY(anticipated_payment_frequency) OR 'WEEKLY' = ANY(anticipated_payment_frequency);

UPDATE plan_payments
SET anticipated_payment_frequency_other =
      CASE
        WHEN anticipated_payment_frequency_other IS NOT NULL AND anticipated_payment_frequency_other <> '' THEN
          anticipated_payment_frequency_other || ', ' || (
            SELECT string_agg(CASE
                                WHEN val = 'SEMIMONTHLY' THEN 'Semi-monthly'
                                END, ', ')
            FROM unnest(anticipated_payment_frequency) AS val
            WHERE val IN ('SEMIMONTHLY')
          )
        ELSE
          (
            SELECT string_agg(CASE
                                WHEN val = 'SEMIMONTHLY' THEN 'Semi-monthly'
                                END, ', ')
            FROM unnest(anticipated_payment_frequency) AS val
            WHERE val IN ('SEMIMONTHLY')
          )
        END
WHERE 'SEMIMONTHLY' = ANY(anticipated_payment_frequency);

ALTER TABLE plan_payments
  ADD COLUMN anticipated_payment_frequency_new TEXT[];

-- Append new values to data_sharing_frequency_new based on conditions
UPDATE plan_payments
  SET anticipated_payment_frequency_new = array_append(anticipated_payment_frequency_new, 'CONTINUALLY')
  WHERE 'DAILY' = ANY(anticipated_payment_frequency) OR 'WEEKLY' = ANY(anticipated_payment_frequency);

UPDATE plan_payments
  SET anticipated_payment_frequency_new = array_append(anticipated_payment_frequency_new, 'OTHER')
  WHERE 'SEMIMONTHLY' = ANY(anticipated_payment_frequency);

-- Drop old column and rename the new one
ALTER TABLE plan_payments
  DROP COLUMN anticipated_payment_frequency;

ALTER TABLE plan_payments
  RENAME COLUMN anticipated_payment_frequency_new TO anticipated_payment_frequency;

-- Alter plan_payments anticipated_payment_frequency to use the common
-- frequency_type enum
ALTER TABLE plan_payments
  ALTER COLUMN anticipated_payment_frequency TYPE FREQUENCY_TYPE[]
    USING CASE
            WHEN anticipated_payment_frequency IS NULL THEN NULL
            ELSE anticipated_payment_frequency::FREQUENCY_TYPE[]
    END;
