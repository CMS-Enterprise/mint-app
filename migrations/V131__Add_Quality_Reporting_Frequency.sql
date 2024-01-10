ALTER TABLE plan_ops_eval_and_learning
  ADD COLUMN quality_reporting_frequency_continually ZERO_STRING,
  ADD COLUMN quality_reporting_frequency_other ZERO_STRING,
  ADD COLUMN quality_reporting_frequency FREQUENCY_TYPE_NEW[] DEFAULT NULL;
