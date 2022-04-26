create table model_plan (
    id uuid PRIMARY KEY not null,
    model_name TEXT,
    model_category model_category, --select from list
    cms_center cms_center, --should select from list
    cmmi_group cmmi_group[],
    archived bool NOT NULL DEFAULT false,
    created_by eua_id,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
