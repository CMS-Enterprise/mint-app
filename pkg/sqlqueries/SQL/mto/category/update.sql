UPDATE mto_category
SET 
    name= :name,
    position= :position,
    modified_by= :modified_by,
    modified_dts= CURRENT_TIMESTAMP
WHERE  mto_category.id = :id
RETURNING
id, 
name, 
parent_id, 
model_plan_id, 
position,
created_by, 
created_dts, 
modified_by, 
modified_dts;
