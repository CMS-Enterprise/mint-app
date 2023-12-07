CREATE TYPE YES_NO_FILTER AS ENUM ('YES', 'NO');

ALTER TABLE plan_beneficiaries
  ADD COLUMN precedence_rules_exist YES_NO_FILTER[] DEFAULT NULL,
  ADD COLUMN precedence_rules_exist_yes ZERO_STRING DEFAULT NULL,
  ADD COLUMN precedence_rules_exist_no ZERO_STRING DEFAULT NULL;
