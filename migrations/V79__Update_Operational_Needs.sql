/* Convert column type to TEXT */
ALTER TABLE possible_operational_need
ALTER COLUMN need_key TYPE TEXT;


/* this function relies on the key, will be updated in a future PR */
DROP FUNCTION create_possible_need_solultion_link;

/* Drop Operational Need Key */
DROP TYPE OPERATIONAL_NEED_KEY;

/* Add new needs */

INSERT INTO possible_operational_need("id", "need_name", "need_key", "section", "trigger_table", "trigger_col", "trigger_vals", "created_by") VALUES
(28, 'Sign Participation Agreements', 'SIGN_PARTICIPATION_AGREEMENTS', 'GENERAL_CHARACTERISTICS', 'plan_general_characteristics', '{agreement_types}', '{PARTICIPATION}', '00000001-0001-0001-0001-000000000001'),
(29, 'Vet providers for program integrity', 'VET_PROVIDERS_FOR_PROGRAM_INTEGRITY', 'PARTICIPANTS_AND_PROVIDERS', 'plan_participants_and_providers', '{participants_ids}', '{TINS, NPIS, CCNS}', '00000001-0001-0001-0001-000000000001'),
(30, 'Utilize quality measures development contractor', 'UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR', 'OPERATIONS_EVALUATION_AND_LEARNING', 'plan_ops_eval_and_learning', '{develop_new_quality_measures}', '{t}', '00000001-0001-0001-0001-000000000001'),
(31, 'IT platform for learning', 'IT_PLATFORM_FOR_LEARNING', 'OPERATIONS_EVALUATION_AND_LEARNING', 'plan_ops_eval_and_learning', '{model_learning_systems}', '{IT_PLATFORM_CONNECT}', '00000001-0001-0001-0001-000000000001');


/* Update existing needs */
UPDATE possible_operational_need
SET
    need_name = 'Recruit participants',
    need_key = 'RECRUIT_PARTICIPANTS',
    trigger_vals = '{LOI, NOFO,APPLICATION_COLLECTION_TOOL}',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = current_timestamp

WHERE need_key = 'ADVERTISE_MODEL';


UPDATE possible_operational_need
SET
    need_name = 'Review and score applications',
    need_key = 'REV_SCORE_APP',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = current_timestamp

WHERE need_key = 'COL_REV_SCORE_APP';


/* Add new need keys */
CREATE TYPE OPERATIONAL_NEED_KEY AS ENUM (
    'OTHER',
    'MANAGE_CD',
    'REV_COL_BIDS',
    'UPDATE_CONTRACT',
    'RECRUIT_PARTICIPANTS',
    'REV_SCORE_APP',
    'APP_SUPPORT_CON',
    'COMM_W_PART',
    'MANAGE_PROV_OVERLAP',
    'MANAGE_BEN_OVERLAP',
    'HELPDESK_SUPPORT',
    'IDDOC_SUPPORT',
    'ESTABLISH_BENCH',
    'PROCESS_PART_APPEALS',
    'ACQUIRE_AN_EVAL_CONT',
    'DATA_TO_MONITOR',
    'DATA_TO_SUPPORT_EVAL',
    'CLAIMS_BASED_MEASURES',
    'QUALITY_PERFORMANCE_SCORES',
    'SEND_REPDATA_TO_PART',
    'ACQUIRE_A_LEARN_CONT',
    'PART_TO_PART_COLLAB',
    'EDUCATE_BENEF',
    'ADJUST_FFS_CLAIMS',
    'MANAGE_FFS_EXCL_PAYMENTS',
    'MAKE_NON_CLAIMS_BASED_PAYMENTS',
    'COMPUTE_SHARED_SAVINGS_PAYMENT',
    'RECOVER_PAYMENTS',
    'SIGN_PARTICIPATION_AGREEMENTS',
    'VET_PROVIDERS_FOR_PROGRAM_INTEGRITY',
    'UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR',
    'IT_PLATFORM_FOR_LEARNING'
);


/* Convert column type to back to  OPERATIONAL_NEED_KEY*/
ALTER TABLE possible_operational_need
ALTER COLUMN need_key TYPE OPERATIONAL_NEED_KEY
USING need_key::OPERATIONAL_NEED_KEY;
