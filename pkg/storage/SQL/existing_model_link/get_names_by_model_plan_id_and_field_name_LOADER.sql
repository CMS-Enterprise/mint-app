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
            WHEN eml.current_model_plan_id IS NOT NULL THEN plan.model_name
            ELSE existing_model.model_name
        END AS model_name

    FROM QUERIED_IDS AS qIDs
    INNER JOIN existing_model_link AS eml ON eml.model_plan_id = qIDs.model_plan_id AND eml.field_name = qIDs.field_name
    LEFT JOIN model_plan AS plan ON plan.id = eml.current_model_plan_id
    LEFT JOIN existing_model AS existing_model ON existing_model.id = eml.existing_model_id
),

ordered_links AS (
    SELECT * FROM links ORDER BY model_name
)

SELECT
    model_plan_id,
    field_name,
    ARRAY_AGG(model_name) AS name_array
FROM ordered_links GROUP BY model_plan_id, field_name
