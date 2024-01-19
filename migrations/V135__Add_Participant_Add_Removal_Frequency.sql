ALTER TABLE plan_participants_and_providers
  -- participant_added_frequency columns
  ADD COLUMN participant_added_frequency_continually ZERO_STRING,
  ADD COLUMN participant_added_frequency_other ZERO_STRING,
  ADD COLUMN participant_added_frequency_note ZERO_STRING,
  ADD COLUMN participant_added_frequency FREQUENCY_TYPE[],

-- participant_removed_frequency columns
  ADD COLUMN participant_removed_frequency_continually ZERO_STRING,
  ADD COLUMN participant_removed_frequency_other ZERO_STRING,
  ADD COLUMN participant_removed_frequency_note ZERO_STRING,
  ADD COLUMN participant_removed_frequency FREQUENCY_TYPE[];
