CREATE TYPE YES_NO_FILTER AS ENUM (
  'YES',
  'NO'
  );

ALTER TABLE plan_beneficiaries
  DROP COLUMN precedence_rules;

ALTER TABLE plan_beneficiaries
  ADD COLUMN precedence_rules YES_NO_FILTER[] DEFAULT NULL,
  ADD COLUMN precedence_rules_yes ZERO_STRING,
  ADD COLUMN precedence_rules_no ZERO_STRING,
  ADD COLUMN precedence_rules_note ZERO_STRING;
