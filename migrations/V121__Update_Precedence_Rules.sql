CREATE TYPE YES_NO_TYPE AS ENUM (
  'YES',
  'NO'
  );

ALTER TABLE plan_beneficiaries
  ADD COLUMN precedence_rules_note ZERO_STRING;

UPDATE plan_beneficiaries
  SET modified_by = '00000001-0001-0001-0001-000000000001', --System Account
      modified_dts = current_timestamp
WHERE precedence_rules IS NOT NULL
  AND precedence_rules != '';


UPDATE plan_beneficiaries
  SET precedence_rules_note = precedence_rules
WHERE precedence_rules IS NOT NULL
  AND precedence_rules != '';

ALTER TABLE plan_beneficiaries
  DROP COLUMN precedence_rules;

ALTER TABLE plan_beneficiaries
  ADD COLUMN precedence_rules YES_NO_TYPE[] DEFAULT NULL,
  ADD COLUMN precedence_rules_yes ZERO_STRING,
  ADD COLUMN precedence_rules_no ZERO_STRING;
