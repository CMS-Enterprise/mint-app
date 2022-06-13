--PAGE 1
CREATE TYPE TOOLS_PART_C_D_TYPE AS ENUM ('MARx', 'OTHER');
CREATE TYPE TOOLS_COLLECT_BIDS_TYPE AS ENUM ('HPMS', 'OTHER');
CREATE TYPE TOOLS_UPDATE_CONTRACT_TYPE AS ENUM (
    --TODO Verify this, this is the same type as collect bids, but it seems to make sense to use this type for future use
    'HPMS',
    'OTHER'
);
--PAGE 2
CREATE TYPE PP_TOOLS_TO_ADVERTISE_TYPE AS ENUM (
    'SALESFORCE',
    'GRANT_SOLUTIONS',
    'OTHER'
);
CREATE TYPE PP_TOOLS_COLLECT_SCORE_REVIEW_TYPE AS ENUM (
    'RFA',
    'ARS',
    'GRANT_SOLUTIONS',
    'OTHER'
);
CREATE TYPE PP_TOOLS_APP_SUPPORT_CONTRACTOR_TYPE AS ENUM (
    'RMDA',
    'OTHER'
);
--PAGE 3
CREATE TYPE PP_TOOLS_COMMUNICATE_WITH_PARTICIPANT_TYPE AS ENUM (
    'OUTLOOK_MAILBOX',
    'GOV_DELIVERY',
    'SALESFORCE_PORTAL',
    'OTHER'
);
CREATE TYPE PP_TOOLS_MANAGE_PROVIDER_OVERLAP_TYPE AS ENUM (
    'MDM',
    'OTHER',
    'NA'
);
CREATE TYPE B_TOOLS_MANAGE_BENEFICIARY_OVERLAP_TYPE AS ENUM ( -- NOTE THIS IS THE SAME AS THE ABOVE TYPE, should we combine to one type?
    'MDM',
    'OTHER',
    'NA'
);
--PAGE 4
CREATE TYPE OEL_TOOLS_WORKING_AGREEMENT_TYPE AS ENUM (
    'IAA',
    'OTHER'
);
CREATE TYPE OEL_TOOLS_HELPDESK_SUPPORT_TYPE AS ENUM (
    'CBOSC',
    'CONTRACTOR',
    'OTHER'
);
CREATE TYPE OEL_TOOLS_MANAGE_ACO_TYPE AS ENUM ( --This might already exist in the other section.. --> IDDOC_OPERATIONS_TYPE
    'ACO_OS',
    'ACO_UI',
    'INNOVATION',
    'OTHER'
);
--PAGE 5
CREATE TYPE OEL_TOOLS_PERFORMANCE_BENCHMARK_TYPE AS ENUM ( --IS this already created somewhere?
    'IDR',
    'CCW',
    'OTHER'
);
CREATE TYPE OEL_TOOLS_PROCESS_APPEALS_TYPE AS ENUM (
    'MEDICARE_APPEAL_SYSTEM',
    'OTHER'
);
CREATE TYPE OEL_TOOLS_EVALUATION_CONTRACTOR_TYPE AS ENUM ( --This might be repeated elsewhere
    'RMDA',
    'OTHER'
);
--PAGE 6
CREATE TYPE OEL_TOOLS_COLLECT_DATA_TYPE AS ENUM ( --Check not used elsewhere
    'IDR',
    'CCW',
    'IDOS',
    'ISP',
    'CONTRACTOR',
    'OTHER'
);
CREATE TYPE OEL_TOOLS_OBTAIN_DATA_TYPE AS ENUM ( --Check not used elsewhere
    'CCW',
    'IDOS',
    'ISP',
    'OTHER'
);
CREATE TYPE OEL_TOOLS_CLAIMS_BASED_MEASURES_TYPE AS ENUM (
    'IDR',
    'CCW',
    'OTHER'
);
--PAGE 7

CREATE TABLE it_tools (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan
    --page 1
    gc_tools_part_c_d TOOLS_PART_C_D_TYPE[],
    gc_tools_part_c_d_other TEXT,
    gc_tools_part_c_d_note TEXT,
    gc_tools_collect_bids TOOLS_COLLECT_BIDS_TYPE[],
    gc_tools_collect_bids_other TEXT,
    gc_tools_collect_bids_note TEXT,
    gc_tools_update_contract TOOLS_UPDATE_CONTRACT_TYPE[],
    gc_tools_update_contract_other TEXT,
    gc_tools_update_contract_note TEXT,
    --page 2
    pp_tools_to_advertise PP_TOOLS_TO_ADVERTISE_TYPE[],
    pp_tools_to_advertise_other TEXT,
    pp_tools_to_advertise_note TEXT,
    pp_tools_collect_score_review PP_TOOLS_COLLECT_SCORE_REVIEW_TYPE[],
    pp_tools_collect_score_review_other TEXT,
    pp_tools_collect_score_review_note TEXT,
    pp_tools_app_support_contractor PP_TOOLS_APP_SUPPORT_CONTRACTOR_TYPE[],
    pp_tools_app_support_contractor_other TEXT,
    pp_tools_app_support_contractor_note TEXT,
    --page 3
    pp_tools_communicate_with_participant PP_TOOLS_COMMUNICATE_WITH_PARTICIPANT_TYPE[],
    pp_tools_communicate_with_participant_other TEXT,
    pp_tools_communicate_with_participant_note TEXT,
    pp_tools_manage_provider_overlap PP_TOOLS_MANAGE_PROVIDER_OVERLAP_TYPE[], --ALWAYS REQUIRED
    pp_tools_manage_provider_overlap_other TEXT
    pp_tools_manage_provider_overlap_note TEXT
    b_tools_manage_beneficiary_overlap B_TOOLS_MANAGE_BENEFICIARY_OVERLAP_TYPE[], --ALWAYS REQUIRED
    b_tools_manage_beneficiary_overlap_other TEXT,
    b_tools_manage_beneficiary_overlap_note TEXT,
    --page 4
    oel_tools_working_agreement OEL_TOOLS_WORKING_AGREEMENT_TYPE[],
    oel_tools_working_agreement_other TEXT,
    oel_tools_working_agreement_note TEXT,
    oel_tools_helpdesk_support OEL_TOOLS_HELPDESK_SUPPORT_TYPE[],
    oel_tools_helpdesk_support_other TEXT,
    oel_tools_helpdesk_support_note TEXT,
    oel_tools_manage_aco OEL_TOOLS_MANAGE_ACO_TYPE[], --TODO, should this be IDDOC_OPERATIONS_TYPE that is used for OPS_EVAL && LEARNING?
    oel_tools_manage_aco_other TEXT,
    oel_tools_manage_aco_note TEXT,
    --page 5
    oel_tools_performance_benchmark OEL_TOOLS_PERFORMANCE_BENCHMARK_TYPE[],
    oel_tools_performance_benchmark_other TEXT,
    oel_tools_performance_benchmark_note TEXT,
    oel_tools_process_appeals OEL_TOOLS_PROCESS_APPEALS_TYPE[],
    oel_tools_process_appeals_other TEXT,
    oel_tools_process_appeals_note TEXT,
    oel_tools_evaluation_contractor OEL_TOOLS_EVALUATION_CONTRACTOR_TYPE[],
    oel_tools_evaluation_contractor_other TEXT,
    oel_tools_evaluation_contractor_note TEXT,
    --page 6
    oel_tools_collect_data OEL_TOOLS_COLLECT_DATA_TYPE[],
    oel_tools_collect_data_other TEXT,
    oel_tools_collect_data_note TEXT,
    oel_tools_obtain_data OEL_TOOLS_OBTAIN_DATA_TYPE[],
    oel_tools_obtain_data_other TEXT,
    oel_tools_obtain_data_note TEXT,
    oel_tools_claims_based_measures OEL_TOOLS_CLAIMS_BASED_MEASURES_TYPE[],
    oel_tools_claims_based_measures_other TEXT,
    oel_tools_claims_based_measures_note TEXT,
    --page 7


    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY'
);
ALTER TABLE it_tools
ADD CONSTRAINT fk_it_tools_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
