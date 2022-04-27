CREATE TABLE plan_collaborator (
    id uuid PRIMARY KEY NOT NULL,
    model_plan_id uuid NOT NULL, --foreign key to model plan
    eua_user_id eua_id NOT NULL,
    full_name text NOT NULL,
    team_role team_role NOT NULL,
    created_by eua_id NOT NULL,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id NOT NULL,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE plan_collaborator
ADD CONSTRAINT fk_collaborator_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

ALTER TABLE plan_collaborator
ADD CONSTRAINT unique_collaborator_per_plan UNIQUE (model_plan_id, eua_user_id);
