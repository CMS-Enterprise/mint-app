CREATE TYPE AGENCY_OR_STATE_HELP_TYPE AS ENUM (
    'YES_STATE',
    'YES_AGENCY_IDEAS',
    'YES_AGENCY_IAA',
    'NO',
    'OTHER'
);
CREATE TYPE STAKEHOLDERS_TYPE AS ENUM (
    'BENEFICIARIES',
    'COMMUNITY_ORGANIZATIONS',
    'PARTICIPANTS',
    'PROFESSIONAL_ORGANIZATIONS',
    'PROVIDERS',
    'STATES',
    'OTHER'
);
CREATE TYPE CONTRACTOR_SUPPORT_TYPE AS ENUM (
    'ONE',
    'MULTIPLE',
    'NONE',
    'OTHER'
);
CREATE TYPE MONITORING_FILE_TYPE AS ENUM (
    'BENEFICIARY',
    'PROVIDER',
    'PART_A',
    'PART_B',
    'OTHER'
);
CREATE TYPE EVALUATION_APPROACH_TYPE AS ENUM (
    'CONTROL_INTERVENTION',
    'COMPARISON_MATCH',
    'INTERRUPTED_TIME',
    'NON_MEDICARE_DATA',
    'OTHER'

);
CREATE TYPE CCM_INVOLVMENT_TYPE AS ENUM (
    'YES_EVALUATION',
    'YES__IMPLEMENTATION',
    'NO',
    'OTHER'
);
CREATE TYPE DATA_FOR_MONITORING_TYPE AS ENUM (
    'SITE_VISITS',
    'MEDICARE_CLAIMS',
    'MEDICAID_CLAIMS',
    'ENCOUNTER_DATA',
    'NO_PAY_CLAIMS',
    'QUALITY_CLAIMS_BASED_MEASURES',
    'QUALITY_REPORTED_MEASURES',
    'CLINICAL_DATA',
    'NON_CLINICAL_DATA',
    'NON_MEDICAL_DATA',
    'OTHER',
    'NOT_PLANNING_TO_COLLECT_DATA'
);
CREATE TYPE DATA_TO_SEND_PARTICIPANTS_TYPE AS ENUM (
    'BASELINE_HISTORICAL_DATA',
    'CLAIMS_LEVEL_DATA',
    'BENEFICIARY_LEVEL_DATA',
    'PARTICIPANT_LEVEL_DATA',
    'PROVIDER_LEVEL_DATA',
    'OTHER_MIPS_DATA',
    'NOT_PLANNING_TO_SEND_DATA'
);
CREATE TYPE DATA_FREQUENCY_TYPE AS ENUM (
    'ANNUALLY',
    'BIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'SEMI_MONTHLY',
    'WEEKLY',
    'DAILY',
    'OTHER',
    'NOT_PLANNING_TO_DO_THIS'
);
CREATE TYPE MODEL_LEARNING_SYSTEM_TYPE AS ENUM (
    'LEARNING_CONTRACTOR',
    'IT_PLATFORM_CONNECT',
    'PARTICIPANT_COLLABORATION',
    'EDUCATE_BENEFICIARIES',
    'OTHER',
    'NO_LEARNING_SYSTEM'
);
CREATE TYPE DATA_FULL_TIME_OR_INCREMENTAL_TYPE AS ENUM (
    'FULL_TIME',
    'INCREMENTAL'
);
CREATE TYPE BENCHMARK_FOR_PERFORMANCE_TYPE AS ENUM (
    'YES_RECONCILE',
    'YES_NO_RECONCILE',
    'NO'

);
CREATE TYPE DATA_STARTS_TYPE AS ENUM (
    'DURING_APPLICATION_PERIOD',
    'SHORTLY_BEFORE_THE_START_DATE',
    'EARLY_IN_THE_FIRST_PERFORMANCE_YEAR',
    'LATER_IN_THE_FIRST_PERFORMANCE_YEAR',
    'IN_THE_SUBSEQUENT_PERFORMANCE_YEAR',
    'AT_SOME_OTHER_POINT_IN_TIME',
    'NOT_PLANNING_TO_DO_THIS',
    'OTHER'
);


CREATE TABLE plan_ops_eval_and_learning (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE,   --foreign key to model plan

    --page 1
    agency_or_state_help AGENCY_OR_STATE_HELP_TYPE[],
    agency_or_state_help_other ZERO_STRING,
    agency_or_state_help_note ZERO_STRING,
    stakeholders STAKEHOLDERS_TYPE[],
    stakeholders_other ZERO_STRING,
    stakeholders_note ZERO_STRING,
    helpdesk_use BOOL,
    helpdesk_use_note ZERO_STRING,
    contractor_support CONTRACTOR_SUPPORT_TYPE[],
    contractor_support_other ZERO_STRING,
    contractor_support_how ZERO_STRING,
    contractor_support_note ZERO_STRING,
    iddoc_support BOOL,
    iddoc_support_note ZERO_STRING,

    --page 2
    technical_contacts_identified BOOL,
    technical_contacts_identified_detail ZERO_STRING,
    technical_contacts_identified_note ZERO_STRING,
    capture_participant_info BOOL,
    capture_participant_info_note ZERO_STRING,
    icd_owner ZERO_STRING,
    draft_icd_due_date TIMESTAMP WITH TIME ZONE,
    icd_note ZERO_STRING,

    --page 3
    uat_needs ZERO_STRING,
    stc_needs ZERO_STRING,
    testing_timelines ZERO_STRING,
    testing_note ZERO_STRING,
    data_monitoring_file_types MONITORING_FILE_TYPE[],
    data_monitoring_file_other ZERO_STRING,
    data_response_type ZERO_STRING,
    data_response_file_frequency ZERO_STRING,

    --page 4
    data_full_time_or_incremental DATA_FULL_TIME_OR_INCREMENTAL_TYPE,
    eft_set_up BOOL,
    unsolicited_adjustments_included BOOL,
    data_flow_diagrams_needed BOOL,
    produce_benefit_enhancement_files BOOL,
    file_naming_conventions ZERO_STRING,
    data_monitoring_note ZERO_STRING,

    --page 5
    benchmark_for_performance BENCHMARK_FOR_PERFORMANCE_TYPE,
    benchmark_for_performance_note ZERO_STRING,
    compute_performance_scores BOOL,
    compute_performance_scores_note ZERO_STRING,
    risk_adjust_performance BOOL,
    risk_adjust_feedback BOOL,
    risk_adjust_payments BOOL,
    risk_adjust_other BOOL,
    risk_adjust_note ZERO_STRING,
    appeal_performance BOOL,
    appeal_feedback BOOL,
    appeal_payments BOOL,
    appeal_other BOOL,
    appeal_note ZERO_STRING,

    --page 6
    evaluation_approaches EVALUATION_APPROACH_TYPE[],
    evaluation_approach_other ZERO_STRING,
    evalutaion_approach_note ZERO_STRING,
    ccm_involvment CCM_INVOLVMENT_TYPE[],
    ccm_involvment_other ZERO_STRING,
    ccm_involvment_note ZERO_STRING,
    data_needed_for_monitoring DATA_FOR_MONITORING_TYPE[],
    data_needed_for_monitoring_other ZERO_STRING,
    data_needed_for_monitoring_note ZERO_STRING,
    data_to_send_particicipants DATA_TO_SEND_PARTICIPANTS_TYPE[],
    data_to_send_particicipants_other ZERO_STRING,
    data_to_send_particicipants_note ZERO_STRING,
    share_cclf_data BOOL,
    share_cclf_data_note ZERO_STRING,

    --page 7
    send_files_between_ccw BOOL,
    send_files_between_ccw_note ZERO_STRING,
    app_to_send_files_to_known BOOL,
    app_to_send_files_to_which ZERO_STRING,
    app_to_send_files_to_note ZERO_STRING,
    use_ccw_for_file_distribiution_to_participants BOOL,
    use_ccw_for_file_distribiution_to_participants_note ZERO_STRING,
    develop_new_quality_measures BOOL,
    develop_new_quality_measures_note ZERO_STRING,
    quality_performance_impacts_payment BOOL,
    quality_performance_impacts_payment_note ZERO_STRING,

    --page 8
    data_sharing_starts DATA_STARTS_TYPE,
    data_sharing_starts_other ZERO_STRING,
    data_sharing_frequency DATA_FREQUENCY_TYPE[],
    data_sharing_frequency_other ZERO_STRING,
    data_sharing_starts_note ZERO_STRING,
    data_collection_starts DATA_STARTS_TYPE,
    data_collection_starts_other ZERO_STRING,
    data_collection_frequency DATA_FREQUENCY_TYPE[],
    data_collection_frequency_other ZERO_STRING,
    data_collection_frequency_note ZERO_STRING,
    quality_reporting_starts DATA_STARTS_TYPE,
    quality_reporting_starts_other ZERO_STRING,
    quality_reporting_starts_note ZERO_STRING,

    --page 9
    model_learning_systems MODEL_LEARNING_SYSTEM_TYPE[],
    model_learning_systems_other ZERO_STRING,
    model_learning_systems_note ZERO_STRING,
    anticipated_challenges ZERO_STRING,


    --META
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    ready_for_review_by EUA_ID,
    ready_for_review_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY'
);


ALTER TABLE plan_ops_eval_and_learning
ADD CONSTRAINT fk_ops_eval_and_learning_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
