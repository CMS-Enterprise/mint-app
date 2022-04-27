SELECT 
        id,
        model_name,
        model_category,
        cms_center,
        status,
        cmmi_group,
        archived,
        created_by,
        created_dts,
        modified_by,
        modified_dts
FROM model_plan
WHERE created_by = :euaID AND archived = :archived
