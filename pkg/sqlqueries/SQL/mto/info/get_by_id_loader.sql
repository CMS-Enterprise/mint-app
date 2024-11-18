WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    mto_info.id,
    -- for simplicity we return the id again as the model plan id
    mto_info.id AS model_plan_id,
    mto_info.ready_for_review_by,
    mto_info.ready_for_review_dts,
    mto_info.created_by,
    mto_info.created_dts,
    mto_info.modified_by,
    mto_info.modified_dts
FROM mto_info
-- id and model plan id are equivalent here.
INNER JOIN QUERIED_IDS AS qIDs ON mto_info.id = qIDs.model_plan_id;
