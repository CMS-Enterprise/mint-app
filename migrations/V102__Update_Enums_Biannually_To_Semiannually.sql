-- Add the new enum value
ALTER TYPE frequency_type ADD VALUE 'SEMIANNUALLY';
ALTER TYPE pp_anticipated_payment_frequency_type ADD VALUE 'SEMIANNUALLY';
ALTER TYPE data_frequency_type ADD VALUE 'SEMIANNUALLY';

-- Update the columns that use the old enum values to use the new ones
UPDATE plan_beneficiaries SET beneficiary_selection_frequency = 'SEMIANNUALLY' WHERE beneficiary_selection_frequency = 'BIANNUALLY';
UPDATE plan_participants_and_providers SET provider_addition_frequency = 'SEMIANNUALLY' WHERE provider_addition_frequency = 'BIANNUALLY';
UPDATE plan_ops_eval_and_learning SET data_sharing_frequency = ARRAY['SEMIANNUALLY'] WHERE 'BIANNUALLY' = ANY(data_sharing_frequency);
UPDATE plan_ops_eval_and_learning SET data_collection_frequency = ARRAY['SEMIANNUALLY'] WHERE 'BIANNUALLY' = ANY(data_collection_frequency);
UPDATE plan_payments SET anticipated_payment_frequency = ARRAY['SEMIANNUALLY'] WHERE 'BIANNUALLY' = ANY(anticipated_payment_frequency);

-- Create new enums excluding the old value
CREATE TYPE temp_frequency_type AS ENUM ('ANNUALLY', 'SEMIANNUALLY', 'QUARTERLY', 'MONTHLY', 'ROLLING', 'OTHER');
CREATE TYPE temp_pp_anticipated_payment_frequency_type AS ENUM ('ANNUALLY', 'SEMIANNUALLY', 'QUARTERLY', 'MONTHLY', 'SEMIMONTHLY', 'WEEKLY', 'DAILY', 'OTHER');
CREATE TYPE temp_data_frequency_type AS ENUM ('ANNUALLY', 'SEMIANNUALLY', 'QUARTERLY', 'MONTHLY', 'SEMI_MONTHLY', 'WEEKLY', 'DAILY', 'OTHER', 'NOT_PLANNING_TO_DO_THIS');

-- Change column types to new enums
ALTER TABLE plan_beneficiaries ALTER COLUMN beneficiary_selection_frequency TYPE temp_frequency_type USING beneficiary_selection_frequency::text::temp_frequency_type;
ALTER TABLE plan_participants_and_providers ALTER COLUMN provider_addition_frequency TYPE temp_frequency_type USING provider_addition_frequency::text::temp_frequency_type;
ALTER TABLE plan_ops_eval_and_learning ALTER COLUMN data_sharing_frequency TYPE temp_data_frequency_type[] USING ARRAY[CAST(UNNEST(data_sharing_frequency) AS TEXT)::temp_data_frequency_type];
ALTER TABLE plan_ops_eval_and_learning ALTER COLUMN data_collection_frequency TYPE temp_data_frequency_type[] USING ARRAY[CAST(UNNEST(data_collection_frequency) AS TEXT)::temp_data_frequency_type];
ALTER TABLE plan_payments ALTER COLUMN anticipated_payment_frequency TYPE temp_pp_anticipated_payment_frequency_type[] USING ARRAY[CAST(UNNEST(anticipated_payment_frequency) AS TEXT)::temp_pp_anticipated_payment_frequency_type];

-- Drop old enums
DROP TYPE frequency_type;
DROP TYPE pp_anticipated_payment_frequency_type;
DROP TYPE data_frequency_type;

-- Rename new enums to original names
ALTER TYPE temp_frequency_type RENAME TO frequency_type;
ALTER TYPE temp_pp_anticipated_payment_frequency_type RENAME TO pp_anticipated_payment_frequency_type;
ALTER TYPE temp_data_frequency_type RENAME TO data_frequency_type;
