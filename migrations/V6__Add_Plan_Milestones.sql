CREATE TABLE plan_milestones (
    id uuid PRIMARY KEY,
    model_plan_id uuid not null, 

    enter_cms_clearance  timestamp with time zone NULL,
    enter_hhs_omb_clearance  timestamp with time zone NULL,
    cleared  timestamp with time zone NULL,
    announced  timestamp with time zone NULL,
    applications_due  timestamp with time zone NULL,
    participants_announced  timestamp with time zone NULL,
    performance_period_starts  timestamp with time zone NULL,
    performance_period_ends  timestamp with time zone NULL,

    created_by eua_id,
    created_dts timestamp with time zone,
    modified_by eua_id,
    modified_dts timestamp with time zone

);

ALTER TABLE plan_milestones

        ADD CONSTRAINT fk_milestones_plan FOREIGN KEY (model_plan_id)
        REFERENCES public.model_plan (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;
