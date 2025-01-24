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

COMMENT ON TABLE mto_common_milestone IS 'Table for defining common milestones with attributes such as name, category, facilitation roles, and configuration for suggesting milestone trigger logic.';

COMMENT ON COLUMN mto_common_milestone.key IS 'Primary key representing a unique identifier for the common milestone.';
COMMENT ON COLUMN mto_common_milestone.name IS 'Name of the milestone; must be a non-empty string.';
COMMENT ON COLUMN mto_common_milestone.category_name IS 'Name of the category associated with the milestone. This is used for auto creation of and categorization of milestones in the app.';
COMMENT ON COLUMN mto_common_milestone.sub_category_name IS 'Optional subcategory name associated with the milestone. This is used for auto creation of and categorization of milestones in the app.';
COMMENT ON COLUMN mto_common_milestone.facilitated_by_role IS 'Array of roles (MTO_FACILITATOR) responsible for facilitating this milestone.';
COMMENT ON COLUMN mto_common_milestone.section IS 'Section of the task list where this milestone is relevant, represented as a TASK_LIST_SECTION.';
COMMENT ON COLUMN mto_common_milestone.trigger_table IS 'Name of the table containing trigger data for this milestone.';
COMMENT ON COLUMN mto_common_milestone.trigger_col IS 'Array of column names from the trigger table that are used to determine if this common milestone is suggested or not.';
COMMENT ON COLUMN mto_common_milestone.trigger_vals IS 'Array of values that correspond to the answer in the trigger_col that will result in this common milestone being suggested';
