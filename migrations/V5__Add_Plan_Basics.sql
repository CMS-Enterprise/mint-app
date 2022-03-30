create table plan_basics (
    id uuid PRIMARY KEY not null,
    model_plan_id uuid not null, --foreign key to model plan
    eua_user_id eua_id,
    model_name text,
    model_category text,
    cms_center text, --should select from list
    cmmi_group text,
    model_type text,

    created_by eua_id,
    created_dts timestamp with time zone,
    modified_by eua_id,
    modified_dts timestamp with time zone

);
