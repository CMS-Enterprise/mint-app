-- Create the mto_common_solution_contractor table
CREATE TABLE mto_common_solution_contractor (
    id UUID PRIMARY KEY NOT NULL,
    mto_common_solution_key MTO_COMMON_SOLUTION_KEY REFERENCES mto_common_solution(key) NOT NULL,
    contractor_title ZERO_STRING NULL,
    contractor_name ZERO_STRING NOT NULL,

    -- META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_common_solution_contractor IS 'Table for storing contractor information related to MTO common solutions.';

SELECT audit.AUDIT_TABLE('public', 'mto_common_solution_contractor', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]);
