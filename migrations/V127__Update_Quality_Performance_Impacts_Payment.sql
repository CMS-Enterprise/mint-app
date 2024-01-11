CREATE TYPE QUALITY_PERFORMANCE_IMPACT_TYPE AS ENUM (
  'YES',
  'NO',
  'OTHER'
);

-- Add quality_performance_impacts_payment_other to table
ALTER TABLE plan_ops_eval_and_learning
  ADD COLUMN quality_performance_impacts_payment_other zero_string;

-- Alter the quality_performance_impacts_payment column to use new QUALITY_PERFORMANCE_IMPACT_TYPE enum instead of BOOL
ALTER TABLE plan_ops_eval_and_learning
  ALTER COLUMN quality_performance_impacts_payment TYPE QUALITY_PERFORMANCE_IMPACT_TYPE USING (
        CASE quality_performance_impacts_payment
        WHEN TRUE  THEN 'YES'::QUALITY_PERFORMANCE_IMPACT_TYPE
        WHEN FALSE THEN 'NO'::QUALITY_PERFORMANCE_IMPACT_TYPE
        END
    );
