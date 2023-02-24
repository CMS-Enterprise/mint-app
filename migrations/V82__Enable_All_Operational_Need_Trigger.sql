/* ENABLE need trigger on needed tables */

ALTER TABLE plan_ops_eval_and_learning
ENABLE TRIGGER operational_need_trigger;

ALTER TABLE plan_participants_and_providers
ENABLE TRIGGER operational_need_trigger;

ALTER TABLE plan_payments
ENABLE TRIGGER operational_need_trigger;

ALTER TABLE plan_beneficiaries
ENABLE TRIGGER operational_need_trigger;

ALTER TABLE plan_general_characteristics
ENABLE TRIGGER operational_need_trigger;
