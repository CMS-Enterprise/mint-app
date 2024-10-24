SELECT
    id, 
    name, 
    parent_id, 
    model_plan_id, 
    created_by, 
    created_dts, 
    modified_by, 
    modified_dts
FROM mto_category
WHERE  id = :id;
