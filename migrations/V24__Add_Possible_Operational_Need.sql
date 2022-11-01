CREATE TYPE OPERATIONAL_NEED_KEY AS ENUM (
    'OTHER',
    'MANAGE_CD',
    'REV_COL_BIDS',
    'UPDATE_CONTRACT',
    'ADVERTISE_MODEL',
    'COL_REV_SCORE_APP',
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
    'RECOVER_PAYMENTS'
);

CREATE TYPE TASK_LIST_SECTION AS ENUM (
    'BASICS',
    'GENERAL_CHARACTERISTICS',
    'PARTICIPANTS_AND_PROVIDERS',
    'BENEFICIARIES',
    'OPERATIONS_EVALUATION_AND_LEARNING',
    'PAYMENT',
    'IT_TOOLS',
    'PREPARE_FOR_CLEARANCE'

);

CREATE TABLE possible_operational_need (
    id SERIAL PRIMARY KEY NOT NULL, -- instead of UUID
    need_name ZERO_STRING NOT NULL,
    need_key OPERATIONAL_NEED_KEY NOT NULL,

    section TASK_LIST_SECTION NOT NULL,
    trigger_table TEXT NOT NULL, -- assume public
    trigger_col TEXT [] NOT NULL,
    trigger_vals TEXT[] NOT NULL,



    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);


ALTER TABLE possible_operational_need
ADD CONSTRAINT unique_enum_pos_op_need UNIQUE (need_key);

COMMENT ON TABLE possible_operational_need IS
'This table specifies the possible needs that a model plan could have.';

COMMENT ON COLUMN possible_operational_need.trigger_table IS
'This is used by the SET_OPERATIONAL_NEED_NEEDED trigger function to associate a need to a database table';

COMMENT ON COLUMN possible_operational_need.trigger_col IS
'This is used by the SET_OPERATIONAL_NEED_NEEDED trigger function to associate specific columns to an operational need.
The trigger will use these to see if any value has changed associated to these columns';

COMMENT ON COLUMN possible_operational_need.trigger_vals IS
'This is used by the SET_OPERATIONAL_NEED_NEEDED trigger function to specify the options that specify if a need is needed.
 The trigger will look at all the current values of the columns specified, and check if any  of those column values match the trigger_vals value.
 If so, the operation_need associated with that model plan is needed.';
