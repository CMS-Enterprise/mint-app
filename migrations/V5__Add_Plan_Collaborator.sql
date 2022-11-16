CREATE TYPE TEAM_ROLE AS ENUM (
    'MODEL_LEAD',
    'MODEL_TEAM',
    'LEADERSHIP',
    'LEARNING',
    'EVALUATION',
    'IT_LEAD'
);
CREATE TABLE plan_collaborator (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL, --foreign key to model plan
    eua_user_id EUA_ID NOT NULL,
    full_name ZERO_STRING NOT NULL,
    team_role TEAM_ROLE NOT NULL,
    email EMAIL NOT NULL,
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);

ALTER TABLE plan_collaborator
ADD CONSTRAINT fk_collaborator_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

ALTER TABLE plan_collaborator
ADD CONSTRAINT unique_collaborator_per_plan UNIQUE (model_plan_id, eua_user_id);
