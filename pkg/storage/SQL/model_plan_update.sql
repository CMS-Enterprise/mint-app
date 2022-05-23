UPDATE model_plan
SET
    model_name = :model_name,
    model_category = :model_category,
    cms_centers = :cms_centers,
    cms_other = :cms_other,
    status = :status,
    cmmi_groups = :cmmi_groups,
    archived = :archived,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE model_plan.id = :id
RETURNING
id,
model_name,
model_category,
cms_centers,
cms_other,
cmmi_groups,
archived,
status,
created_by,
created_dts,
modified_by,
modified_dts;
