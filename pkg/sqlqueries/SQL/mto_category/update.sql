UPDATE mto_category
SET 
    id= :id,
    name= :name,
    parent_id= :parent_id,
    model_plan_id= :model_plan_id,
    created_by= :created_by,
    created_dts= :created_dts,
    modified_by= :modified_by,
    modified_dts= :modified_dts
WHERE  mto_category.id = :id;
