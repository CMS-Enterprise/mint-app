ALTER TABLE plan_payments
  ADD COLUMN payment_reconciliation_frequency_continually ZERO_STRING,
  ADD COLUMN payment_reconciliation_frequency_other ZERO_STRING,
  ADD COLUMN payment_reconciliation_frequency_note ZERO_STRING,
  ADD COLUMN payment_reconciliation_frequency FREQUENCY_TYPE_NEW[];
