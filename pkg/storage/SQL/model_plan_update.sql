UPDATE model_plan
SET 
    model_name = :model_name,
    model_category = :model_category,
    cms_center = :cms_center,
    cmmi_group = :cmmi_group,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE model_plan.id = :id

    RETURNING 
        id,
        model_name,
        model_category,
        cms_center,
        cmmi_group,
        created_by,
        created_dts,
        modified_by,
        modified_dts
        ;
