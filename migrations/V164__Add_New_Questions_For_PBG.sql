-- Add new columns to plan_payments
ALTER TABLE plan_payments
ADD COLUMN will_be_payment_adjustments BOOLEAN,
ADD COLUMN will_be_payment_adjustments_note ZERO_STRING;

COMMENT ON COLUMN plan_payments.will_be_payment_adjustments IS 'True or false if there will be payment adjustments applied to this model.';
COMMENT ON COLUMN plan_payments.will_be_payment_adjustments_note IS 'A note field for will_be_payment_adjustments';


-- Add new column to participants and providers
ALTER TABLE plan_participants_and_providers
ADD COLUMN is_new_type_of_providers_or_suppliers BOOLEAN;


COMMENT ON COLUMN plan_participants_and_providers.is_new_type_of_providers_or_suppliers IS 'This represents whether the listed providers or suppliers are new.';
