SELECT 
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
FROM model_plan
WHERE id = :id 
