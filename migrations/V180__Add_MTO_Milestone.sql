CREATE TYPE MTO_MILESTONE_STATUS AS ENUM (
    'MILESTONE_STATUS_ONE',
    'MILESTONE_STATUS_TWO'
);


CREATE TABLE mto_milestone (
    id UUID PRIMARY KEY,
    name ZERO_STRING NOT NULL,
    facilitated_by MTO_FACILITATOR,
    need_by TIMESTAMP WITH TIME ZONE,
    status MTO_MILESTONE_STATUS NOT NULL,
    risk_indicator MTO_RISK_INDICATOR,
    is_draft BOOLEAN NOT NULL DEFAULT TRUE,
    -- commonMilestoneID TODO: Based on Common Milestone Tables
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
