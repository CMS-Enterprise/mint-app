create table model_plan (
    id uuid PRIMARY KEY not null,
    model_name TEXT,
    model_category TEXT, --select from list
    cms_center TEXT, --should select from list
    cmmi_group TEXT,
    created_by eua_id,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
