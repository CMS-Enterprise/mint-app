SELECT 
        mp.id,
        mp.model_name,
        mp.model_category,
        mp.cms_center,
        mp.status,
        mp.cmmi_group,
        mp.archived,
        mp.created_by,
        mp.created_dts,
        mp.modified_by,
        mp.modified_dts
FROM model_plan mp
JOIN plan_collaborator pc on pc.model_plan_id =mp.id

WHERE pc.eua_user_id = :euaID and mp.archived = :archived
