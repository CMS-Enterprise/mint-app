CREATE TABLE plan_basics (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    model_type MODEL_TYPE,

    problem ZERO_STRING,
    goal ZERO_STRING,
    test_interventions ZERO_STRING,
    note ZERO_STRING,



    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,

    ready_for_review_by EUA_ID,
    ready_for_review_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY' -- can become and ENUM/TYPE
);

ALTER TABLE plan_basics
ADD CONSTRAINT fk_basics_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
