--TODO (mto) confirm these statuses

CREATE TYPE MTO_SOLUTION_STATUS AS ENUM (
    'BACKLOG',
    'NOT_STARTED',
    'IN_PROGRESS'
);
CREATE TYPE MTO_SOLUTION_TYPE AS ENUM (
    'IT_SYSTEM',
    'CONTRACT',
    'CROSS_CUTTING_GROUP',
    'OTHER',
);

/*
TODO, finish implementing this
*/

CREATE TABLE mto_solution(
    id UUID PRIMARY KEY,
    mto_common_solution_id UUID REFERENCES mto_common_solution(id),
    -- we allow null because this is will be from the commonMilestone table if it exists
    name ZERO_STRING,
    -- we allow null because this is will be from the commonMilestone table if it exists
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
