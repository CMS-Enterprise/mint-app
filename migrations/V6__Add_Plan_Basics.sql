create table plan_basics (
    id uuid PRIMARY KEY not null,
    model_plan_id uuid not null, --foreign key to model plan
    model_name TEXT,
    model_category TEXT, --select from list
    cms_center TEXT, --should select from list
    cmmi_group TEXT,
    model_type TEXT,

    problem TEXT,
    goal TEXT,
    test_inventions TEXT,
    note TEXT,



    created_by eua_id,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT -- can become and ENUM/TYPE
);

ALTER TABLE plan_basics
    ADD CONSTRAINT fk_basics_plan FOREIGN KEY (model_plan_id)
        REFERENCES public.model_plan (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
