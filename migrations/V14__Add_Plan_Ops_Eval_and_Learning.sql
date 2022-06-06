CREATE TABLE plans_ops_eval_and_learning (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE,   --foreign key to model plan

    --page 1
    agency_or_state_help AGENCY_OR_STATE_HELP_TYPE[],
    agency_or_state_help_note TEXT,
    stakeholders STAKEHOLDERS_TYPE[],
    stakeholders_other TEXT,
    stakeholders_note TEXT,
    helpdesk_use HELPDESK_USE_TYPE[],
    helpdesk_use_other TEXT,
    helpdesk_use_note TEXT,
    contractor_support CONTRACTOR_SUPPORT_TYPE[],
    contractor_support_other TEXT,
    contractor_support_how TEXT,
    contractor_support_note TEXT,
    iddoc_support BOOL,
    iddoc_support_note TEXT,

    --page 2
    iddoc_operations IDDOC_OPERATIONS_TYPE,
    iddoc_operations_other TEXT,
    iddoc_operations_note TEXT,
    technical_contacts_identified BOOL,
    technical_contacts_identified_detail TEXT,
    technical_contacts_identified_note TEXT,
    capture_participant_info TEXT,
    capture_participant_info_note TEXT,
    icd_owner TEXT,
    draft_icd_due_date timestamp,
    icd_note TEXT,

    --page 3
    uat_needs TEXT,
    stc_needs TEXT,
    testing_timelines TEXT,
    testing_note TEXT,
    data_monitoring_file_types MONITORING_FILE_TYPE[],
    data_monitoring_file_other TEXT,
    data_response_type TEXT,
    data_response_file_frequency TEXT,

    --page 4
    data_full_time_or_incremental DATA_FULL_TIME_OR_INCREMENTAL_TYPE,
    eft_set_up BOOL,
    unsolicited_adjustments_included BOOL,
    data_flow_diagrams_needed BOOL,
    produce_benefit_enhancement_files BOOL,
    file_naming_conventions TEXT,
    data_monitoring_note TEXT,

    --page 5
    benchmark_for_performance BENCHMARK_FOR_PERFORMANCE_TYPE,
    benchmark_for_performance_note TEXT,
    compute_performance_scores BOOL,
    compute_performance_scores_note TEXT,
    risk_adjust_performance BOOL,
    risk_adjust_feedback BOOL,
    risk_adjust_payments BOOL,
    risk_adjust_other BOOL,
    risk_adjust_note TEXT,
    appeal_performance BOOL,
    appeal_feedback BOOL,
    appeal_payments BOOL,
    appeal_other BOOL,
    appeal_note TEXT,

    --page 6
    evaluation_approaches EVALUATION_APPROACH_TYPE[],
    evaluation_approach_other TEXT,
    evalutaion_approach_note TEXT,
    ccm_involvment CCM_INVOLVMENT_TYPE[],
    ccm_involvment_other TEXT,
    ccm_involvment_note TEXT,
    data_needed_for_monitoring DATA_FOR_MONITORING_TYPE[],
    data_needed_for_monitoring_other TEXT,
    data_needed_for_monitoring_note TEXT,
    data_to_send_particicipants DATA_TO_SEND_PARTICIPANTS_TYPE[],
    data_to_send_particicipants_other TEXT,
    data_to_send_particicipants_note TEXT,
    share_cclf_data BOOL,
    share_cclf_data_note TEXT,

    --page 7
    send_files_between_ccw BOOL,
    send_files_between_ccw_note TEXT,
    app_to_send_files_to_known BOOL,
    app_to_send_files_to_which TEXT,
    app_to_send_files_to_note BOOL,
    use_ccw_for_file_distribiution_to_participants BOOL,
    use_ccw_for_file_distribiution_to_participants_note TEXT,
    develop_new_quality_measures BOOL,
    develop_new_quality_measures_note TEXT,
    quality_performance_impacts_payment BOOL,
    quality_performance_impacts_payment_note TEXT,

    --page 8
    data_sharing_starts DATA_STARTS_TYPE,
    data_sharing_starts_other TEXT,
    data_sharing_frequency DATA_FREQUENCY_TYPE[],
    data_sharing_frequency_other TEXT,
    data_sharing_starts_note TEXT,
    data_collection_starts DATA_STARTS_TYPE,
    data_collection_starts_other TEXT,
    data_collection_frequency DATA_FREQUENCY_TYPE[],
    data_collection_frequency_other TEXT,
    data_collection_frequency_note TEXT,
    quality_reporting_starts DATA_STARTS_TYPE,
    quality_reporting_starts_other TEXT,
    quality_reporting_starts_note TEXT,

    --page 9
    model_learning_systems MODEL_LEARNING_SYSTEM_TYPE[],
    model_learning_systems_other TEXT,
    model_learning_systems_note TEXT,
    anticipated_challenges TEXT


    --META
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY'
);


ALTER TABLE plans_ops_eval_and_learning
ADD CONSTRAINT fk_ops_eval_and_learning_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
