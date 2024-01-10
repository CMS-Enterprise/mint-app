ALTER TABLE plan_beneficiaries
  ADD COLUMN beneficiary_removal_frequency_continually ZERO_STRING,
  ADD COLUMN beneficiary_removal_frequency_other ZERO_STRING,
  ADD COLUMN beneficiary_removal_frequency_note ZERO_STRING,
  ADD COLUMN beneficiary_removal_frequency FREQUENCY_TYPE_NEW[];
