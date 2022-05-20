CREATE TABLE model_plan (
    id UUID PRIMARY KEY NOT NULL,
    model_name TEXT NOT NULL,
    model_category MODEL_CATEGORY, --select from list
    cms_centers CMS_CENTER[], --should select from list
    cms_other TEXT,
    cmmi_groups CMMI_GROUP[],
    archived BOOL NOT NULL DEFAULT FALSE,
    status MODEL_PLAN_STATUS NOT NULL,
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);
