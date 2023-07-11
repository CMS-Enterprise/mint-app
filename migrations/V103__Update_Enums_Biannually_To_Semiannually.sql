-- Update the columns that use the old enum values to use the new ones
UPDATE plan_beneficiaries
SET beneficiary_selection_frequency = 'SEMIANNUALLY'
WHERE beneficiary_selection_frequency = 'BIANNUALLY';
UPDATE plan_participants_and_providers
SET provider_addition_frequency = 'SEMIANNUALLY'
WHERE provider_addition_frequency = 'BIANNUALLY';
UPDATE plan_ops_eval_and_learning
SET data_sharing_frequency = ARRAY ['SEMIANNUALLY']::data_frequency_type[]
WHERE 'BIANNUALLY' = ANY (data_sharing_frequency);
UPDATE plan_ops_eval_and_learning
SET data_collection_frequency = ARRAY ['SEMIANNUALLY']::data_frequency_type[]
WHERE 'BIANNUALLY' = ANY (data_collection_frequency);
UPDATE plan_payments
SET anticipated_payment_frequency = ARRAY ['SEMIANNUALLY']::pp_anticipated_payment_frequency_type[]
WHERE 'BIANNUALLY' = ANY (anticipated_payment_frequency);
