CREATE TABLE plan_basics (
    id uuid PRIMARY KEY NOT NULL,
    model_plan_id uuid NOT NULL UNIQUE, --foreign key to model plan

    model_type model_type,

    problem text,
    goal text,
    test_inventions text,
    note text,



    created_by eua_id,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status task_status NOT NULL DEFAULT 'READY' -- can become and ENUM/TYPE
);

ALTER TABLE plan_basics
ADD CONSTRAINT fk_basics_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
