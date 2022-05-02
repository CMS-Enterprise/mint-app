CREATE TABLE plan_milestones (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    complete_icip TIMESTAMP WITH TIME ZONE NULL,
    clearance_starts TIMESTAMP WITH TIME ZONE NULL,
    clearance_ends TIMESTAMP WITH TIME ZONE NULL,

    announced TIMESTAMP WITH TIME ZONE NULL,


    applications_starts TIMESTAMP WITH TIME ZONE NULL,
    applications_ends TIMESTAMP WITH TIME ZONE NULL,

    -- participants_announced TIMESTAMP WITH TIME ZONE NULL, --No spot in the FIGMA for this?

    performance_period_starts TIMESTAMP WITH TIME ZONE NULL,
    performance_period_ends TIMESTAMP WITH TIME ZONE NULL,

    wrap_up_ends TIMESTAMP WITH TIME ZONE NULL,
    high_level_note TEXT,

    phased_in BOOLEAN,
    phased_in_note TEXT,


    created_by EUA_ID,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TASK_STATUS NOT NULL DEFAULT 'READY'

);

ALTER TABLE plan_milestones

ADD CONSTRAINT fk_milestones_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;
