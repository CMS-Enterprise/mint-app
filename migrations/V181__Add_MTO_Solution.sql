--TODO (mto) confirm these statuses once more

CREATE TYPE MTO_SOLUTION_STATUS AS ENUM (
    'NOT_STARTED',
    'ONBOARDING',
    'BACKLOG',
    'IN_PROGRESS',
    'COMPLETED',
    'AT_RISK'
);

COMMENT ON TYPE MTO_SOLUTION_STATUS IS 
'Defines the stages of progress for solutions within the model plan, from not started to completion.';

CREATE TYPE MTO_SOLUTION_TYPE AS ENUM (
    'IT_SYSTEM',
    'CONTRACT',
    'CROSS_CUTTING_GROUP',
    'OTHER'
);
-- TODO (mto) the solution type might need to move to the common solution migration. A common solution should likely have a type defined with it


COMMENT ON TYPE MTO_SOLUTION_TYPE IS 
'Specifies the type of solution, such as IT system, contract, cross-cutting group, or other, to categorize solutions used within the model plan.';

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
COMMENT ON TABLE mto_solution IS 
'Tracks solutions associated with a model plan. Each solution may reference a common solution or have a unique name specific to the plan. Includes solution type, facilitator, status, risk indicator, and point-of-contact details.';

ALTER TABLE mto_solution
ADD CONSTRAINT unique_mto_common_solution_per_model_plan UNIQUE (model_plan_id, mto_common_solution_id);

COMMENT ON CONSTRAINT unique_mto_common_solution_per_model_plan ON mto_solution IS 
'Ensures each common solution is associated with a given model plan only once.';


CREATE UNIQUE INDEX unique_name_per_model_plan_when_mto_common_solution_is_null
ON mto_solution (model_plan_id, name)
WHERE mto_common_solution_id IS NULL;

COMMENT ON INDEX unique_name_per_model_plan_when_mto_common_solution_is_null IS 
'Unique index to enforce that solution names are unique per model plan when no common solution is associated.';


ALTER TABLE mto_solution
ADD CONSTRAINT check_name_or_common_solution_null CHECK (
    (mto_common_solution_id IS NULL OR name IS NULL)
    AND NOT (mto_common_solution_id IS NULL AND name IS NULL)
);

COMMENT ON CONSTRAINT check_name_or_common_solution_null ON mto_solution IS 
'Ensures either mto_common_solution_id or name is null, but not both: if a common solution is referenced, name must be null; if name is specified, no common solution may be referenced.';
