BEGIN;
  -- Rename old types to back them up
  ALTER TYPE frequency_type RENAME TO frequency_type_old;
  ALTER TYPE data_frequency_type RENAME TO data_frequency_type_old;
  ALTER TYPE pp_anticipated_payment_frequency_type RENAME TO pp_anticipated_payment_frequency_type_old;

  -- Create new enum types
  CREATE TYPE frequency_type AS ENUM (
    'ANNUALLY',
    'SEMIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'WEEKLY',
    'DAILY');

  CREATE TYPE data_frequency_type AS ENUM (
    'ANNUALLY',
    'SEMIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'SEMI_MONTHLY',
    'WEEKLY',
    'DAILY',
    'OTHER',
    'NOT_PLANNING_TO_DO_THIS');

  CREATE TYPE pp_anticipated_payment_frequency_type AS ENUM (
    'ANNUALLY',
    'SEMIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'SEMIMONTHLY',
    'WEEKLY',
    'DAILY',
    'OTHER');

  -- Add new columns with the new data types
  ALTER TABLE plan_beneficiaries ADD COLUMN new_beneficiary_selection_frequency frequency_type;
  ALTER TABLE plan_participants_and_providers ADD COLUMN new_provider_addition_frequency frequency_type;
  ALTER TABLE plan_ops_eval_and_learning ADD COLUMN new_data_sharing_frequency data_frequency_type[];
  ALTER TABLE plan_ops_eval_and_learning ADD COLUMN new_data_collection_frequency data_frequency_type[];
  ALTER TABLE plan_payments ADD COLUMN new_anticipated_payment_frequency pp_anticipated_payment_frequency_type[];

  -- Copy data from old columns to the new ones
  UPDATE plan_beneficiaries
  SET new_beneficiary_selection_frequency = beneficiary_selection_frequency::text::frequency_type
  WHERE beneficiary_selection_frequency IS NOT NULL;

  UPDATE plan_participants_and_providers
  SET new_provider_addition_frequency = provider_addition_frequency::text::frequency_type
  WHERE provider_addition_frequency IS NOT NULL;

  UPDATE plan_ops_eval_and_learning
  SET new_data_sharing_frequency = ARRAY(SELECT unnest(data_sharing_frequency)::text::data_frequency_type)
  WHERE data_sharing_frequency IS NOT NULL;

  UPDATE plan_ops_eval_and_learning
  SET new_data_collection_frequency = ARRAY(SELECT unnest(data_collection_frequency)::text::data_frequency_type)
  WHERE data_collection_frequency IS NOT NULL;

  UPDATE plan_payments
  SET new_anticipated_payment_frequency = ARRAY(SELECT unnest(anticipated_payment_frequency)::text::pp_anticipated_payment_frequency_type)
  WHERE anticipated_payment_frequency IS NOT NULL;

  -- Drop old columns
  ALTER TABLE plan_beneficiaries DROP COLUMN beneficiary_selection_frequency;
  ALTER TABLE plan_participants_and_providers DROP COLUMN provider_addition_frequency;
  ALTER TABLE plan_ops_eval_and_learning DROP COLUMN data_sharing_frequency;
  ALTER TABLE plan_ops_eval_and_learning DROP COLUMN data_collection_frequency;
  ALTER TABLE plan_payments DROP COLUMN anticipated_payment_frequency;

  -- Rename new columns to old ones
  ALTER TABLE plan_beneficiaries RENAME COLUMN new_beneficiary_selection_frequency TO beneficiary_selection_frequency;
  ALTER TABLE plan_participants_and_providers RENAME COLUMN new_provider_addition_frequency TO provider_addition_frequency;
  ALTER TABLE plan_ops_eval_and_learning RENAME COLUMN new_data_sharing_frequency TO data_sharing_frequency;
  ALTER TABLE plan_ops_eval_and_learning RENAME COLUMN new_data_collection_frequency TO data_collection_frequency;
  ALTER TABLE plan_payments RENAME COLUMN new_anticipated_payment_frequency TO anticipated_payment_frequency;

  -- Drop old types
  DROP TYPE frequency_type_old;
  DROP TYPE data_frequency_type_old;
  DROP TYPE pp_anticipated_payment_frequency_type_old;

COMMIT;
