CREATE TABLE plan_milestones (
    id uuid PRIMARY KEY,
    model_plan_id uuid not null, 

    enter_cms_clearance null timestamp with time zone,
    enter_hhs_omb_clearance null timestamp with time zone,
    cleared null timestamp with time zone,
    announced null timestamp with time zone,
    applications_due null timestamp with time zone,
    participants_announced null timestamp with time zone,
    performance_period_starts null timestamp with time zone,
    performance_period_ends null timestamp with time zone,

    created_by eua_id,
    created_dts timestamp with time zone,
    modified_by eua_id,
    modified_dts timestamp with time zone

)

ALTER TABLE plan_milestones

        ADD CONSTRAINT fk_milestones_plan FOREIGN KEY (model_plan_id)
        REFERENCES public.model_plan (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;
