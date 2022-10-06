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

CREATE TABLE possible_operational_need (
    id SERIAL PRIMARY KEY NOT NULL, -- instead of UUID
    full_name ZERO_STRING NOT NULL,
    short_name OPERATIONAL_NEED_KEY NOT NULL,


    --TODO add fields
    -- possible_solutions UUID[], --TODO should this live on the solutions table to identify what the solution will satisfy? Or here?

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);


ALTER TABLE possible_operational_need
ADD CONSTRAINT unique_enum_pos_op_need UNIQUE (short_name);
-- ALTER TABLE operational_need
-- ADD CONSTRAINT fk_cr_tdl_plan FOREIGN KEY (model_plan_id)
-- REFERENCES public.model_plan (id) MATCH SIMPLE
-- ON UPDATE NO ACTION
-- ON DELETE NO ACTION;
