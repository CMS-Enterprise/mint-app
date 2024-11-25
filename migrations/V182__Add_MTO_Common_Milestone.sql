CREATE TYPE MTO_COMMON_MILESTONE_KEY AS ENUM (
    'MANAGE_CD',
    'REV_COL_BIDS',
    'UPDATE_CONTRACT',
    'SIGN_PARTICIPATION_AGREEMENTS',
    'RECRUIT_PARTICIPANTS',
    'REV_SCORE_APP',
    'APP_SUPPORT_CON',
    'COMM_W_PART',
    'VET_PROVIDERS_FOR_PROGRAM_INTEGRITY',
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
    'UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR',
    'ACQUIRE_A_LEARN_CONT',
    'PART_TO_PART_COLLAB',
    'EDUCATE_BENEF',
    'IT_PLATFORM_FOR_LEARNING',
    'ADJUST_FFS_CLAIMS',
    'MANAGE_FFS_EXCL_PAYMENTS',
    'MAKE_NON_CLAIMS_BASED_PAYMENTS',
    'COMPUTE_SHARED_SAVINGS_PAYMENT',
    'RECOVER_PAYMENTS'
);

COMMENT ON TYPE MTO_COMMON_MILESTONE_KEY IS 'These keys represent all the various options available for an mto milestone. They are configured in mto_common_milestone table and referenced in mto_milestone';

CREATE TABLE mto_common_milestone (
    key MTO_COMMON_MILESTONE_KEY NOT NULL PRIMARY KEY,
    name ZERO_STRING NOT NULL,

    category_name ZERO_STRING NOT NULL,
    sub_category_name ZERO_STRING,

    facilitated_by_role MTO_FACILITATOR[] NOT NULL,
    /* Configuration for suggesting milestone trigger logic */
    section TASK_LIST_SECTION NOT NULL,
    trigger_table TEXT NOT NULL,
    trigger_col TEXT[] NOT NULL,
    trigger_vals TEXT[] NOT NULL
    /**** end configuration***/
);
-- TODO (mto) add comments to these new fields
