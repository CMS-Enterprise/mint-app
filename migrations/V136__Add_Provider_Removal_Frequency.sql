ALTER TABLE plan_participants_and_providers
  ADD COLUMN provider_removal_frequency_continually ZERO_STRING,
  ADD COLUMN provider_removal_frequency_other ZERO_STRING,
  ADD COLUMN provider_removal_frequency_note ZERO_STRING,
  ADD COLUMN provider_removal_frequency FREQUENCY_TYPE[];
