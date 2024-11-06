UPDATE mto_category
SET 
    name= :name,
    modified_by= :modified_by,
    modified_dts= CURRENT_TIMESTAMP
WHERE  mto_category.id = :id
RETURNING
id, 
name, 
parent_id, 
model_plan_id, 
created_by, 
created_dts, 
modified_by, 
modified_dts;
