INSERT INTO model_plan (
    id,
    model_name,
    model_category,
    cms_centers,
    cms_other,
    status,
    cmmi_groups,
    created_by,
    modified_by
)
VALUES (
    :id,
    :model_name,
    :model_category,
    :cms_centers,
    NULLIF(:cms_other, ''),
    :status,
    :cmmi_groups,
    :created_by,
    :modified_by
)
RETURNING
id,
model_name,
model_category,
cms_centers,
cms_other,
status,
cmmi_groups,
archived,
created_by,
created_dts,
modified_by,
modified_dts;
