--PAGE 1
CREATE TYPE GC_PART_C_D_TYPE AS ENUM (
    'MARX',
    'OTHER'
);
CREATE TYPE GC_COLLECT_BIDS_TYPE AS ENUM (
    'HPMS',
    'OTHER'
);
CREATE TYPE GC_UPDATE_CONTRACT_TYPE AS ENUM (
    --TODO Verify this, this is the same type as collect bids, but it seems to make sense to use this type for future use
    'HPMS',
    'OTHER'
);
--PAGE 2
CREATE TYPE PP_TO_ADVERTISE_TYPE AS ENUM (
    'SALESFORCE',
    'GRANT_SOLUTIONS',
    'OTHER'
);
CREATE TYPE PP_COLLECT_SCORE_REVIEW_TYPE AS ENUM (
    'RFA',
    'ARS',
    'GRANT_SOLUTIONS',
    'OTHER'
);
CREATE TYPE PP_APP_SUPPORT_CONTRACTOR_TYPE AS ENUM (
    'RMDA',
    'OTHER'
);
--PAGE 3
CREATE TYPE PP_COMMUNICATE_WITH_PARTICIPANT_TYPE AS ENUM (
    'OUTLOOK_MAILBOX',
    'GOV_DELIVERY',
    'SALESFORCE_PORTAL',
    'OTHER'
);
CREATE TYPE PP_MANAGE_PROVIDER_OVERLAP_TYPE AS ENUM (
    'MDM',
    'OTHER',
    'NA'
);
CREATE TYPE B_MANAGE_BENEFICIARY_OVERLAP_TYPE AS ENUM ( -- NOTE THIS IS THE SAME AS THE ABOVE TYPE, should we combine to one type?
    'MDM',
    'OTHER',
    'NA'
);
--PAGE 4
CREATE TYPE OEL_HELPDESK_SUPPORT_TYPE AS ENUM (
    'CBOSC',
    'CONTRACTOR',
    'OTHER'
);
CREATE TYPE OEL_MANAGE_ACO_TYPE AS ENUM ( --This might already exist in the other section.. --> IDDOC_OPERATIONS_TYPE
    'ACO_OS',
    'ACO_UI',
    'INNOVATION',
    'OTHER'
);
--PAGE 5
CREATE TYPE OEL_PERFORMANCE_BENCHMARK_TYPE AS ENUM ( --IS this already created somewhere?
    'IDR',
    'CCW',
    'OTHER'
);
CREATE TYPE OEL_PROCESS_APPEALS_TYPE AS ENUM (
    'MEDICARE_APPEAL_SYSTEM',
    'OTHER'
);
CREATE TYPE OEL_EVALUATION_CONTRACTOR_TYPE AS ENUM ( --This might be repeated elsewhere
    'RMDA',
    'OTHER'
);
--PAGE 6
CREATE TYPE OEL_COLLECT_DATA_TYPE AS ENUM ( --Check not used elsewhere
    'IDR',
    'CCW',
    'IDOS',
    'ISP',
    'CONTRACTOR',
    'OTHER'
);
CREATE TYPE OEL_OBTAIN_DATA_TYPE AS ENUM ( --Check not used elsewhere
    'CCW',
    'IDOS',
    'ISP',
    'OTHER'
);
CREATE TYPE OEL_CLAIMS_BASED_MEASURES_TYPE AS ENUM (
    'IDR',
    'CCW',
    'OTHER'
);
--PAGE 7
CREATE TYPE OEL_QUALITY_SCORES_TYPE AS ENUM (
    'EXISTING_DATA_AND_PROCESS',
    'NEW_DATA_AND_CMMI_PROCESS',
    'OTHER',
    'NONE'
);
CREATE TYPE OEL_SEND_REPORTS_TYPE AS ENUM (
    'IDOS',
    'RMADA',
    'INTERNAL_STAFF',
    'OTHER'
);
CREATE TYPE OEL_LEARNING_CONTRACTOR_TYPE AS ENUM (
    'RMADA',
    'CROSS_MODEL_CONTRACT',
    'OTHER'
);
--PAGE 8
CREATE TYPE OEL_PARTICIPANT_COLLABORATION_TYPE AS ENUM (
    'CONNECT',
    'OTHER'
);
CREATE TYPE OEL_EDUCATE_BENEFICIARIES_TYPE AS ENUM (
    'OC',
    'OTHER'
);
CREATE TYPE P_MAKE_CLAIMS_PAYMENTS_TYPE AS ENUM (
    'SHARED_SYSTEMS',
    'HIGLAS',
    'OTHER'
);
CREATE TYPE P_INFORM_FFS_TYPE AS ENUM (
    'FFS_COMPETENCY_CENTER',
    'OTHER'
);
CREATE TYPE P_NON_CLAIMS_BASED_PAYMENTS_TYPE AS ENUM (
    'APPS',
    'HIGLAS',
    'IPC',
    'MAC',
    'OTHER'
);
CREATE TYPE P_SHARED_SAVINGS_PLAN_TYPE AS ENUM (
    'RMADA',
    'OTHER'
);
CREATE TYPE P_RECOVER_PAYMENTS_TYPE AS ENUM (
    'APPS',
    'IPC',
    'MAC',
    'OTHER'
);
CREATE TABLE plan_it_tools (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan
    --page 1
    gc_part_c_d GC_PART_C_D_TYPE[],
    gc_part_c_d_other ZERO_STRING,
    gc_part_c_d_note ZERO_STRING,
    gc_collect_bids GC_COLLECT_BIDS_TYPE[],
    gc_collect_bids_other ZERO_STRING,
    gc_collect_bids_note ZERO_STRING,
    gc_update_contract GC_UPDATE_CONTRACT_TYPE[],
    gc_update_contract_other ZERO_STRING,
    gc_update_contract_note ZERO_STRING,
    --page 2
    pp_to_advertise PP_TO_ADVERTISE_TYPE[],
    pp_to_advertise_other ZERO_STRING,
    pp_to_advertise_note ZERO_STRING,
    pp_collect_score_review PP_COLLECT_SCORE_REVIEW_TYPE[],
    pp_collect_score_review_other ZERO_STRING,
    pp_collect_score_review_note ZERO_STRING,
    pp_app_support_contractor PP_APP_SUPPORT_CONTRACTOR_TYPE[],
    pp_app_support_contractor_other ZERO_STRING,
    pp_app_support_contractor_note ZERO_STRING,
    --page 3
    pp_communicate_with_participant PP_COMMUNICATE_WITH_PARTICIPANT_TYPE[],
    pp_communicate_with_participant_other ZERO_STRING,
    pp_communicate_with_participant_note ZERO_STRING,
    pp_manage_provider_overlap PP_MANAGE_PROVIDER_OVERLAP_TYPE[], --ALWAYS REQUIRED
    pp_manage_provider_overlap_other ZERO_STRING,
    pp_manage_provider_overlap_note ZERO_STRING,
    b_manage_beneficiary_overlap B_MANAGE_BENEFICIARY_OVERLAP_TYPE[], --ALWAYS REQUIRED
    b_manage_beneficiary_overlap_other ZERO_STRING,
    b_manage_beneficiary_overlap_note ZERO_STRING,
    --page 4
    oel_helpdesk_support OEL_HELPDESK_SUPPORT_TYPE[],
    oel_helpdesk_support_other ZERO_STRING,
    oel_helpdesk_support_note ZERO_STRING,
    oel_manage_aco OEL_MANAGE_ACO_TYPE[], --TODO, should this be IDDOC_OPERATIONS_TYPE that is used for OPS_EVAL && LEARNING?
    oel_manage_aco_other ZERO_STRING,
    oel_manage_aco_note ZERO_STRING,
    --page 5
    oel_performance_benchmark OEL_PERFORMANCE_BENCHMARK_TYPE[],
    oel_performance_benchmark_other ZERO_STRING,
    oel_performance_benchmark_note ZERO_STRING,
    oel_process_appeals OEL_PROCESS_APPEALS_TYPE[],
    oel_process_appeals_other ZERO_STRING,
    oel_process_appeals_note ZERO_STRING,
    oel_evaluation_contractor OEL_EVALUATION_CONTRACTOR_TYPE[],
    oel_evaluation_contractor_other ZERO_STRING,
    oel_evaluation_contractor_note ZERO_STRING,
    --page 6
    oel_collect_data OEL_COLLECT_DATA_TYPE[],
    oel_collect_data_other ZERO_STRING,
    oel_collect_data_note ZERO_STRING,
    oel_obtain_data OEL_OBTAIN_DATA_TYPE[],
    oel_obtain_data_other ZERO_STRING,
    oel_obtain_data_note ZERO_STRING,
    oel_claims_based_measures OEL_CLAIMS_BASED_MEASURES_TYPE[],
    oel_claims_based_measures_other ZERO_STRING,
    oel_claims_based_measures_note ZERO_STRING,
    --page 7
    oel_quality_scores OEL_QUALITY_SCORES_TYPE[],
    oel_quality_scores_other ZERO_STRING,
    oel_quality_scores_note ZERO_STRING,
    oel_send_reports OEL_SEND_REPORTS_TYPE[],
    oel_send_reports_other ZERO_STRING,
    oel_send_reports_note ZERO_STRING,
    oel_learning_contractor OEL_LEARNING_CONTRACTOR_TYPE[],
    oel_learning_contractor_other ZERO_STRING,
    oel_learning_contractor_note ZERO_STRING,
    --page 8 
    oel_participant_collaboration OEL_PARTICIPANT_COLLABORATION_TYPE[],
    oel_participant_collaboration_other ZERO_STRING,
    oel_participant_collaboration_note ZERO_STRING,
    oel_educate_beneficiaries OEL_EDUCATE_BENEFICIARIES_TYPE[],
    oel_educate_beneficiaries_other ZERO_STRING,
    oel_educate_beneficiaries_note ZERO_STRING,
    p_make_claims_payments P_MAKE_CLAIMS_PAYMENTS_TYPE[],
    p_make_claims_payments_other ZERO_STRING,
    p_make_claims_payments_note ZERO_STRING,
    --page 9
    p_inform_ffs P_INFORM_FFS_TYPE[],
    p_inform_ffs_other ZERO_STRING,
    p_inform_ffs_note ZERO_STRING,
    p_non_claims_based_payments P_NON_CLAIMS_BASED_PAYMENTS_TYPE[],
    p_non_claims_based_payments_other ZERO_STRING,
    p_non_claims_based_payments_note ZERO_STRING,
    p_shared_savings_plan P_SHARED_SAVINGS_PLAN_TYPE[],
    p_shared_savings_plan_other ZERO_STRING,
    p_shared_savings_plan_note ZERO_STRING,
    --page 10
    p_recover_payments P_RECOVER_PAYMENTS_TYPE[],
    p_recover_payments_other ZERO_STRING,
    p_recover_payments_note ZERO_STRING,

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY'
);
ALTER TABLE plan_it_tools
ADD CONSTRAINT fk_it_tools_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
