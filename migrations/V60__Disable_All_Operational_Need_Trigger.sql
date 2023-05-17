/* disable need trigger as it is currently non-functional until needs are migrated */

ALTER TABLE plan_ops_eval_and_learning
DISABLE TRIGGER operational_need_trigger;

ALTER TABLE plan_participants_and_providers
DISABLE TRIGGER operational_need_trigger;

ALTER TABLE plan_payments
DISABLE TRIGGER operational_need_trigger;

ALTER TABLE plan_beneficiaries
DISABLE TRIGGER operational_need_trigger;

ALTER TABLE plan_general_characteristics
DISABLE TRIGGER operational_need_trigger;
