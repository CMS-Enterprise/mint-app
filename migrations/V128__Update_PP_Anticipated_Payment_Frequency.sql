-- Convert columns to TEXT array type
ALTER TABLE plan_payments
  ALTER COLUMN anticipated_payment_frequency TYPE TEXT[] USING anticipated_payment_frequency::TEXT[];

-- Alter plan_ops_eval_and_learning.data_sharing_frequency to use this new type
UPDATE plan_payments
SET anticipated_payment_frequency_continually = (
  SELECT string_agg(CASE
                      WHEN val = 'DAILY' THEN 'Daily'
                      WHEN val = 'WEEKLY' THEN 'Weekly'
                      END, ', ')
  FROM unnest(anticipated_payment_frequency) AS val
  WHERE val IN ('DAILY', 'WEEKLY')
);

UPDATE plan_payments
SET anticipated_payment_frequency_other = (
  SELECT string_agg(CASE
                      WHEN val = 'SEMI_MONTHLY' THEN 'Semi-monthly'
                      END, ', ')
  FROM unnest(anticipated_payment_frequency) AS val
  WHERE val IN ('SEMI_MONTHLY')
);

ALTER TABLE plan_payments
  ADD COLUMN anticipated_payment_frequency_new TEXT[];

-- Append new values to data_sharing_frequency_new based on conditions
UPDATE plan_payments
SET anticipated_payment_frequency_new = array_append(anticipated_payment_frequency_new, 'CONTINUALLY')
WHERE 'DAILY' = ANY(anticipated_payment_frequency) OR 'WEEKLY' = ANY(anticipated_payment_frequency);

UPDATE plan_payments
SET anticipated_payment_frequency_new = array_append(anticipated_payment_frequency_new, 'OTHER')
WHERE 'SEMI_MONTHLY' = ANY(anticipated_payment_frequency);

-- Drop old column and rename the new one
ALTER TABLE plan_payments
  DROP COLUMN anticipated_payment_frequency;

ALTER TABLE plan_payments
  RENAME COLUMN anticipated_payment_frequency_new TO anticipated_payment_frequency;

-- Alter plan_payments to use this new type
UPDATE plan_payments
SET anticipated_payment_frequency_continually = (
  SELECT string_agg(CASE
                      WHEN val = 'DAILY' THEN 'Daily'
                      WHEN val = 'WEEKLY' THEN 'Weekly'
                      END, ', ')
  FROM unnest(anticipated_payment_frequency) AS val
  WHERE val IN ('DAILY', 'WEEKLY')
);

-- Alter plan_payments anticipated_payment_frequency to use the common
-- frequency_type enum
ALTER TABLE plan_payments
  ALTER COLUMN anticipated_payment_frequency TYPE FREQUENCY_TYPE[]
    USING CASE
            WHEN anticipated_payment_frequency IS NULL THEN NULL
            ELSE anticipated_payment_frequency::FREQUENCY_TYPE[]
    END;
