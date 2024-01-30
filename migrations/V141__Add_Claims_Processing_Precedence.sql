ALTER TABLE plan_payments
  ADD COLUMN claims_processing_precedence BOOLEAN,
  ADD COLUMN claims_processing_precedence_other ZERO_STRING,
  ADD COLUMN claims_processing_precedence_note ZERO_STRING;
