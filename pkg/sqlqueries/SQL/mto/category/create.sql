INSERT INTO mto_category (
    id,
    name,
    parent_id,
    model_plan_id,
    created_by
)
VALUES (
    :id,
    :name,
    :parent_id,
    :model_plan_id,
    :created_by
)
RETURNING
id, 
name, 
parent_id, 
model_plan_id, 
created_by, 
created_dts, 
modified_by, 
modified_dts;
