-- Create the MTO_COMMON_SOLUTION_OWNER_TYPE enum
CREATE TYPE MTO_COMMON_SOLUTION_OWNER_TYPE AS ENUM (
    'SYSTEM_OWNER',
    'BUSINESS_OWNER'
);

-- Create the mto_common_solution_system_owner table
CREATE TABLE mto_common_solution_system_owner (
    id UUID PRIMARY KEY NOT NULL,
    mto_common_solution_key MTO_COMMON_SOLUTION_KEY REFERENCES mto_common_solution(key) ON DELETE CASCADE NOT NULL,
    owner_type MTO_COMMON_SOLUTION_OWNER_TYPE NOT NULL,
    cms_component ZERO_STRING NOT NULL,

    -- META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_common_solution_system_owner IS 'Table for storing system owner information related to MTO common solutions.';

-- Add constraint to ensure only one or fewer system owners per common solution key
ALTER TABLE mto_common_solution_system_owner
ADD CONSTRAINT uniq_system_owner_per_solution_key UNIQUE (mto_common_solution_key);

-- Add audit triggers for the table
SELECT audit.AUDIT_TABLE('public', 'mto_common_solution_system_owner', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]);
