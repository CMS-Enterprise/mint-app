WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    mto_info.id,
    mto_info.model_plan_id,
    mto_info.ready_for_review_by,
    mto_info.ready_for_review_dts,
    mto_info.created_by,
    mto_info.created_dts,
    mto_info.modified_by,
    mto_info.modified_dts
FROM mto_info
INNER JOIN QUERIED_IDS AS qIDs ON mto_info.model_plan_id = qIDs.model_plan_id;
