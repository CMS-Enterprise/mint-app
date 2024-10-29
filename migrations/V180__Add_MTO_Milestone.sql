--TODO (mto) confirm these statuses, they could change

CREATE TYPE MTO_MILESTONE_STATUS AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED'
);
COMMENT ON TYPE MTO_MILESTONE_STATUS IS 'Status of the milestone within the model to operation process';


CREATE TABLE mto_milestone (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    mto_common_milestone_id UUID REFERENCES mto_common_milestone(id),
    -- we allow null because this is will be from the commonMilestone table if it exists
    name ZERO_STRING,
    facilitated_by MTO_FACILITATOR,
    need_by TIMESTAMP WITH TIME ZONE,
    status MTO_MILESTONE_STATUS NOT NULL,
    risk_indicator MTO_RISK_INDICATOR NOT NULL DEFAULT 'ON_TRACK',
    is_draft BOOLEAN NOT NULL DEFAULT TRUE,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE mto_milestone IS 'Table to track milestones related to a specific model plan, with status and facilitator details';


CREATE UNIQUE INDEX unique_name_per_model_plan_when_mto_common_milestone_is_null
ON mto_milestone (model_plan_id, name)
WHERE mto_common_milestone_id IS NULL;
COMMENT ON INDEX unique_name_per_model_plan_when_mto_common_milestone_is_null IS 'Unique index to enforce that milestone names are unique per model plan when no common milestone is associated';


ALTER TABLE mto_milestone
ADD CONSTRAINT unique_mto_common_milestone_per_model_plan UNIQUE (model_plan_id, mto_common_milestone_id);
COMMENT ON CONSTRAINT unique_mto_common_milestone_per_model_plan ON mto_milestone IS 'Constraint to ensure that each common milestone can be linked to a model plan only once';


ALTER TABLE mto_milestone
ADD CONSTRAINT check_name_or_common_milestone_null CHECK (
    (mto_common_milestone_id IS NULL OR name IS NULL)
    AND NOT (mto_common_milestone_id IS NULL AND name IS NULL)
);

COMMENT ON CONSTRAINT check_name_or_common_milestone_null ON mto_milestone IS 
'Ensures either mto_common_milestone_id or name is null, but not both: if a common milestone is referenced, name must be null; if name is specified, no common milestone may be referenced.';
