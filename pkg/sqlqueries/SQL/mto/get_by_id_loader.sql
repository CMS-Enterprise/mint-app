WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    mto.id,
    -- for simplicity we return the id again as the model plan id
    mto.id AS model_plan_id,
    mto.ready_for_review_by,
    mto.ready_for_review_dts,
    mto.created_by,
    mto.created_dts,
    mto.modified_by,
    mto.modified_dts
FROM mto
-- id and model plan id are equivalent here.
INNER JOIN QUERIED_IDS AS qIDs ON mto.id = qIDs.model_plan_id;
