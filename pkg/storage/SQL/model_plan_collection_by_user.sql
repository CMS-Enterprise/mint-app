SELECT 
        id,
        model_name,
        model_category,
        cms_center,
        cmmi_group,
        created_by,
        created_dts,
        modified_by,
        modified_dts
FROM model_plan
WHERE created_by = :euaID
