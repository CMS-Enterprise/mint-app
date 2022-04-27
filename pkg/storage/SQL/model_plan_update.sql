UPDATE model_plan
SET
    model_name = :model_name,
    model_category = :model_category,
    cms_center = :cms_center,
    status = :status,
    cmmi_group = :cmmi_group,
    archived = :archived,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE model_plan.id = :id
RETURNING
(
    id,
    model_name,
    model_category,
    cms_center,
    cmmi_group,
    archived,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts
);
