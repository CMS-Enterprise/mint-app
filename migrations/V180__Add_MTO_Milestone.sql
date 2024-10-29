--TODO (mto) confirm these statuses, they could change

CREATE TYPE MTO_MILESTONE_STATUS AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED'
);

CREATE TABLE mto_milestone (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    mto_common_milestone_id UUID REFERENCES mto_common_milestone(id),
    -- we allow null because this is will be from the commonMilestone table if it exists
    name ZERO_STRING,
    facilitated_by MTO_FACILITATOR,
    need_by TIMESTAMP WITH TIME ZONE,
    status MTO_MILESTONE_STATUS NOT NULL,
    risk_indicator MTO_RISK_INDICATOR,
    is_draft BOOLEAN NOT NULL DEFAULT TRUE,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);


-- Adding the partial unique index
CREATE UNIQUE INDEX unique_name_per_model_plan_when_mto_common_milestone_is_null
ON mto_milestone (model_plan_id, name)
WHERE mto_common_milestone_id IS NULL;


ALTER TABLE mto_milestone
ADD CONSTRAINT unique_mto_common_milestone_per_model_plan UNIQUE (model_plan_id, mto_common_milestone_id);
