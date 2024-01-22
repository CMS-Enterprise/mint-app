WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT 
        model_plan_id,
        field_name
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID, "field_name" EXISITING_MODEL_LINK_FIELD_TYPE) --noqa
),

links AS (

SELECT 
qIDs.model_plan_id,
qIDs.field_name,
CASE 
	WHEN eml.current_model_plan_id IS NOT NULL then plan.model_name
	ELSE existing.model_name
END AS model_name

FROM QUERIED_IDS AS qIDs
INNER JOIN existing_model_link AS eml ON eml.model_plan_id = qIDs.model_plan_id AND eml.field_name = qIDS.field_name
LEFT JOIN model_plan as plan on plan.id = eml.current_model_plan_id
LEFT JOIN existing_model as existing on existing.id = eml.existing_model_id
)

SELECT model_plan_id, field_name, array_agg(model_name) AS name_array FROM links GROUP BY model_plan_id, field_name
