ALTER TABLE plan_payments
  ADD COLUMN payment_demand_recoupment_frequency_continually ZERO_STRING,
  ADD COLUMN payment_demand_recoupment_frequency_other ZERO_STRING,
  ADD COLUMN payment_demand_recoupment_frequency_note ZERO_STRING,
  ADD COLUMN payment_demand_recoupment_frequency FREQUENCY_TYPE[];
