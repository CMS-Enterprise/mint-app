/* Add for Analyzed Audit*/
ALTER TABLE analyzed_audit
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE analyzed_audit_history (LIKE analyzed_audit);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON analyzed_audit FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'analyzed_audit', true, true);
/* Add for Discussion Reply*/
ALTER TABLE discussion_reply
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE discussion_reply_history (LIKE discussion_reply);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON discussion_reply FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'discussion_reply', true, true);
/* Add for Existing Model*/
ALTER TABLE existing_model
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE existing_model_history (LIKE existing_model);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON existing_model FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'existing_model', true, true);
/* Add for Model Plan*/
ALTER TABLE model_plan
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE model_plan_history (LIKE model_plan);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON model_plan FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'model_plan', true, true);
/* Add for Nda Agreement*/
ALTER TABLE nda_agreement
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE nda_agreement_history (LIKE nda_agreement);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON nda_agreement FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'nda_agreement', true, true);
/* Add for Operational Need*/
ALTER TABLE operational_need
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE operational_need_history (LIKE operational_need);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON operational_need FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'operational_need', true, true);
/* Add for Operational Solution*/
ALTER TABLE operational_solution
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE operational_solution_history (LIKE operational_solution);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON operational_solution FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'operational_solution',
        true,
        true
    );
/* Add for Operational Solution Subtask*/
ALTER TABLE operational_solution_subtask
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE operational_solution_subtask_history (LIKE operational_solution_subtask);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON operational_solution_subtask FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'operational_solution_subtask',
        true,
        true
    );
/* Add for Plan Basics*/
ALTER TABLE plan_basics
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_basics_history (LIKE plan_basics);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_basics FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'plan_basics', true, true);
/* Add for Plan Beneficiaries*/
ALTER TABLE plan_beneficiaries
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_beneficiaries_history (LIKE plan_beneficiaries);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_beneficiaries FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'plan_beneficiaries',
        true,
        true
    );
/* Add for Plan Collaborator*/
ALTER TABLE plan_collaborator
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_collaborator_history (LIKE plan_collaborator);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_collaborator FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'plan_collaborator', true, true);
/* Add for Plan Cr Tdl*/
ALTER TABLE plan_cr_tdl
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_cr_tdl_history (LIKE plan_cr_tdl);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_cr_tdl FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'plan_cr_tdl', true, true);
/* Add for Plan Discussion*/
ALTER TABLE plan_discussion
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_discussion_history (LIKE plan_discussion);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_discussion FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'plan_discussion', true, true);
/* Add for Plan Document*/
ALTER TABLE plan_document
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_document_history (LIKE plan_document);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_document FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'plan_document', true, true);
/* Add for Plan Document Solution Link*/
ALTER TABLE plan_document_solution_link
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_document_solution_link_history (LIKE plan_document_solution_link);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_document_solution_link FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'plan_document_solution_link',
        true,
        true
    );
/* Add for Plan Favorite*/
ALTER TABLE plan_favorite
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_favorite_history (LIKE plan_favorite);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_favorite FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'plan_favorite', true, true);
/* Add for Plan General Characteristics*/
ALTER TABLE plan_general_characteristics
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_general_characteristics_history (LIKE plan_general_characteristics);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_general_characteristics FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'plan_general_characteristics',
        true,
        true
    );
/* Add for Plan Ops Eval And Learning*/
ALTER TABLE plan_ops_eval_and_learning
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_ops_eval_and_learning_history (LIKE plan_ops_eval_and_learning);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_ops_eval_and_learning FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'plan_ops_eval_and_learning',
        true,
        true
    );
/* Add for Plan Participants And Providers*/
ALTER TABLE plan_participants_and_providers
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_participants_and_providers_history (LIKE plan_participants_and_providers);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_participants_and_providers FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'plan_participants_and_providers',
        true,
        true
    );
/* Add for Plan Payments*/
ALTER TABLE plan_payments
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE plan_payments_history (LIKE plan_payments);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON plan_payments FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'plan_payments', true, true);
/* Add for Possible Need Solution Link*/
ALTER TABLE possible_need_solution_link
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE possible_need_solution_link_history (LIKE possible_need_solution_link);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON possible_need_solution_link FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'possible_need_solution_link',
        true,
        true
    );
/* Add for Possible Operational Need*/
ALTER TABLE possible_operational_need
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE possible_operational_need_history (LIKE possible_operational_need);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON possible_operational_need FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'possible_operational_need',
        true,
        true
    );
/* Add for Possible Operational Solution*/
ALTER TABLE possible_operational_solution
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE possible_operational_solution_history (LIKE possible_operational_solution);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON possible_operational_solution FOR EACH ROW EXECUTE PROCEDURE versioning(
        'sys_period',
        'possible_operational_solution',
        true,
        true
    );
/* Add for User Account*/
ALTER TABLE user_account
ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE user_account_history (LIKE user_account);
CREATE TRIGGER versioning_trigger BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON user_account FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', 'user_account', true, true);
