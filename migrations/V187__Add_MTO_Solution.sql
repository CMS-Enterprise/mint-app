CREATE TYPE MTO_SOLUTION_STATUS AS ENUM (
    'NOT_STARTED',
    'ONBOARDING',
    'BACKLOG',
    'IN_PROGRESS',
    'COMPLETED'
);

COMMENT ON TYPE MTO_SOLUTION_STATUS IS
'Defines the stages of progress for solutions within the model plan, from not started to completion.';


CREATE TABLE mto_solution(
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    mto_common_solution_key MTO_COMMON_SOLUTION_KEY REFERENCES mto_common_solution(key),
    -- we allow null because this is will be from the commonSolution table if it exists
    name ZERO_STRING,
    -- we allow null because this is will be from the commonSolution table if it exists
    type MTO_SOLUTION_TYPE,
    facilitated_by MTO_FACILITATOR[],
    needed_by TIMESTAMP WITH TIME ZONE,
    status MTO_SOLUTION_STATUS NOT NULL,
    risk_indicator MTO_RISK_INDICATOR NOT NULL DEFAULT 'ON_TRACK',
    -- we allow null because this is is only required for custom solutions
    poc_name ZERO_STRING,
    -- we allow null because this is is only required for custom solutions
    poc_email EMAIL,
    -- TODO (mto) verify that poc information should be nullable. Also, confirm if a solution from a common solution will be allowed to edit POC info
    -- if poc info is not editable for these cases, a constraint should be introduced to not allow these to be filled out

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE mto_solution IS
'Tracks solutions associated with a model plan. Each solution may reference a common solution or have a unique name specific to the plan. Includes solution type, facilitator, status, risk indicator, and point-of-contact details.';

ALTER TABLE mto_solution
ADD CONSTRAINT unique_mto_common_solution_per_model_plan UNIQUE (model_plan_id, mto_common_solution_key);

COMMENT ON CONSTRAINT unique_mto_common_solution_per_model_plan ON mto_solution IS
'Ensures each common solution is associated with a given model plan only once.';


CREATE UNIQUE INDEX unique_name_per_model_plan_when_mto_common_solution_is_null
ON mto_solution (model_plan_id, name)
WHERE mto_common_solution_key IS NULL;

COMMENT ON INDEX unique_name_per_model_plan_when_mto_common_solution_is_null IS
'Unique index to enforce that solution names are unique per model plan when no common solution is associated.';


ALTER TABLE mto_solution
ADD CONSTRAINT check_custom_solution_fields CHECK (
    (mto_common_solution_key IS NULL AND ( name IS NOT NULL AND type IS NOT NULL AND poc_email IS NOT NULL AND poc_name IS NOT NULL))
    OR (mto_common_solution_key IS NOT NULL AND ( name IS NULL AND type IS NULL AND poc_email IS NULL AND poc_name IS NULL))
);

COMMENT ON CONSTRAINT check_custom_solution_fields ON mto_solution IS
'Ensures that if mto_common_solution_key is null (custom solution), name, type, poc_email, and poc_name must be non-null; if mto_common_solution_key is provided, these fields are required to be null (not entered).';
