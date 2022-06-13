CREATE TYPE TOOLS_PART_C_D_TYPE AS ENUM ('MARx', 'OTHER');
CREATE TYPE TOOLS_COLLECT_BIDS_TYPE AS ENUM ('HPMS', 'OTHER');
CREATE TYPE TOOLS_UPDATE_CONTRACT_TYPE AS ENUM (
    --TODO Verify this, this is the same type as collect bids, but it seems to make sense to use this type for future use
    'HPMS',
    'OTHER'
);
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

CREATE TABLE it_tools (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE,
    --foreign key to model plan
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
