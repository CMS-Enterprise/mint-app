CREATE TYPE PLAN_TASK_KEY AS ENUM (
    'MODEL_PLAN',
    'MTO',
    'DATA_EXCHANGE'
);

CREATE TYPE PLAN_TASK_STATUS AS ENUM (
    'NOT_NEEDED',
    'UPCOMING',
    'TO_DO',
    'IN_PROGRESS',
    'COMPLETE'
);

CREATE TABLE plan_task (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL REFERENCES public.model_plan (id),

    key PLAN_TASK_KEY NOT NULL,
    status PLAN_TASK_STATUS NOT NULL,

    completed_by EUA_ID,
    completed_dts TIMESTAMP WITH TIME ZONE,

    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_plan_task_per_key_per_plan UNIQUE (model_plan_id, key)
);
