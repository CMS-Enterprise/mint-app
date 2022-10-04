SELECT 
    OpNd.id
    ,:model_plan_id AS model_plan_id --use a variable here
    ,pOpNd.id AS need_type
    ,pOpNd.full_name AS need_type_full_name
    ,pOpNd.short_name AS need_type_short_name
    ,OpNd.need_other
    ,COALESCE(OpNd.needed,FALSE) AS needed
    ,COALESCE(OpNd.created_by,'NULL') AS created_by
    ,COALESCE(OpNd.created_dts,CURRENT_TIMESTAMP) as created_dts
    ,OpNd.modified_by
    ,OpNd.modified_dts
FROM 
possible_operational_need AS pOpNd
LEFT JOIN operational_need AS OpNd ON OpNd.need_type = pOpNd.id AND OpND.model_plan_id = :model_plan_id 

WHERE OpNd.model_plan_id = :model_plan_id and pOpNd.short_name =:need_type; --Add support for other and other type