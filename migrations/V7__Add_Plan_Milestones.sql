CREATE TABLE plan_milestones (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    enter_cms_clearance TIMESTAMP WITH TIME ZONE NULL,
    enter_hhs_omb_clearance TIMESTAMP WITH TIME ZONE NULL,
    cleared TIMESTAMP WITH TIME ZONE NULL,
    announced TIMESTAMP WITH TIME ZONE NULL,
    applications_due TIMESTAMP WITH TIME ZONE NULL,
    participants_announced TIMESTAMP WITH TIME ZONE NULL,
    performance_period_starts TIMESTAMP WITH TIME ZONE NULL,
    performance_period_ends TIMESTAMP WITH TIME ZONE NULL,

    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID NOT NULL,
    modified_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

);

ALTER TABLE plan_milestones

ADD CONSTRAINT fk_milestones_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;
