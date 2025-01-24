WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    mto_category.id, 
    mto_category.name, 
    mto_category.parent_id, 
    mto_category.model_plan_id, 
    mto_category.position, 
    mto_category.created_by, 
    mto_category.created_dts, 
    mto_category.modified_by, 
    mto_category.modified_dts
FROM mto_category 
INNER JOIN QUERIED_IDS AS qIDs ON mto_category.model_plan_id = qIDs.model_plan_id
ORDER BY mto_category.position;
