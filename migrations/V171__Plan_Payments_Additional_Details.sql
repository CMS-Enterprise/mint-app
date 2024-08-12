ALTER TABLE plan_payments
ADD COLUMN funding_source_patient_protection_info ZERO_STRING,
ADD COLUMN funding_source_r_patient_protection_info ZERO_STRING;
    

COMMENT ON COLUMN plan_payments.funding_source_patient_protection_info IS 'additional information to be provided about the funding source if patient protection info is selected';
COMMENT ON COLUMN plan_payments.funding_source_r_patient_protection_info IS 'additional information to be provided about the funding source for reconciliation if patient protection info is selected';
