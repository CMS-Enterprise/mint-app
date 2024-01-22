ALTER TABLE plan_payments
  ADD COLUMN claims_precedence_processing YES_NO_TYPE[],
  ADD COLUMN claims_precedence_processing_yes ZERO_STRING,
  ADD COLUMN claims_precedence_processing_note ZERO_STRING;
