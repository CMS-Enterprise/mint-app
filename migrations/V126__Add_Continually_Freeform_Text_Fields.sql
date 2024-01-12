ALTER TABLE plan_beneficiaries
  ADD COLUMN  beneficiary_selection_frequency_continually ZERO_STRING DEFAULT NULL;

ALTER TABLE plan_participants_and_providers
  ADD COLUMN provider_addition_frequency_continually ZERO_STRING DEFAULT NULL;

ALTER TABLE plan_ops_eval_and_learning
  ADD COLUMN data_sharing_frequency_continually ZERO_STRING DEFAULT NULL,
  ADD COLUMN data_collection_frequency_continually ZERO_STRING DEFAULT NULL;

ALTER TABLE plan_payments
  ADD COLUMN anticipated_payment_frequency_continually ZERO_STRING DEFAULT NULL;
