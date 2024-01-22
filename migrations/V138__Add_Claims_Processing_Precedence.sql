ALTER TABLE plan_payments
  ADD COLUMN claims_precedence_processing BOOLEAN,
  ADD COLUMN claims_precedence_processing_other ZERO_STRING,
  ADD COLUMN claims_precedence_processing_note ZERO_STRING;
