WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    -- SELECT UNNEST(CAST(:model_plan_ids AS UUID[])) WITH ORDINALITY AS id, ordinality
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS id
)

SELECT
    plan.id,
    plan.model_name,
    plan.abbreviation,
    plan.archived,
    plan.status,
    plan.previous_suggested_phase,
    plan.created_by,
    plan.created_dts,
    plan.modified_by,
    plan.modified_dts

FROM model_plan AS plan
INNER JOIN QUERIED_IDS AS qIDs ON plan.id = qIDs.id;
