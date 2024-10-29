--TODO (mto) confirm these statuses

CREATE TYPE MTO_SOLUTION_STATUS AS ENUM (
    'NOT_STARTED',
    'ONBOARDING',
    'BACKLOG',
    'IN_PROGRESS',
    'COMPLETED',
    'AT_RISK'
);

CREATE TYPE MTO_SOLUTION_TYPE AS ENUM (
    'IT_SYSTEM',
    'CONTRACT',
    'CROSS_CUTTING_GROUP',
    'OTHER'
);

/*
TODO, finish implementing this
*/

CREATE TABLE mto_solution(
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    mto_common_solution_id UUID REFERENCES mto_common_solution(id),
    -- we allow null because this is will be from the commonSolution table if it exists
    name ZERO_STRING,
    -- we allow null because this is will be from the commonSolution table if it exists
    type MTO_SOLUTION_TYPE,
    facilitated_by MTO_FACILITATOR,
    status MTO_SOLUTION_STATUS NOT NULL,
    risk_indicator MTO_RISK_INDICATOR,
    is_draft BOOLEAN NOT NULL DEFAULT TRUE,  --TODO (mto) is this field needed?
    poc_name ZERO_STRING NOT NULL,
    poc_email EMAIL NOT NULL,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

ALTER TABLE mto_solution
ADD CONSTRAINT unique_mto_common_solution_per_model_plan UNIQUE (model_plan_id, mto_common_solution_id);

-- Adding the partial unique index
CREATE UNIQUE INDEX unique_name_per_model_plan_when_mto_common_solution_is_null
ON mto_solution (model_plan_id, name)
WHERE mto_common_solution_id IS NULL;
