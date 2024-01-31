-- Add new columns to plan_general_characteristics
ALTER TABLE plan_general_characteristics
  ADD COLUMN agency_or_state_help AGENCY_OR_STATE_HELP_TYPE[],
  ADD COLUMN agency_or_state_help_other ZERO_STRING,
  ADD COLUMN agency_or_state_help_note ZERO_STRING;

-- Migrate corresponding column data from plan_ops_eval_and_learning to plan_general_characteristics
UPDATE plan_general_characteristics
  SET agency_or_state_help = ARRAY[plan_ops_eval_and_learning.agency_or_state_help],
      agency_or_state_help_other = plan_ops_eval_and_learning.agency_or_state_help_other,
      agency_or_state_help_note = plan_ops_eval_and_learning.agency_or_state_help_note,
      modified_by = '00000001-0001-0001-0001-000000000001', --System Account
      modified_dts = current_timestamp
  FROM plan_ops_eval_and_learning
  WHERE plan_general_characteristics.model_plan_id = plan_ops_eval_and_learning.model_plan_id;

-- Drop old columns from plan_ops_eval_and_learning
ALTER TABLE plan_ops_eval_and_learning
  DROP COLUMN agency_or_state_help,
  DROP COLUMN agency_or_state_help_other,
  DROP COLUMN agency_or_state_help_note;
