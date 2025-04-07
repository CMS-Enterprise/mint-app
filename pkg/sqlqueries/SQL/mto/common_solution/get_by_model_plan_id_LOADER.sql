WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)


SELECT
    mto_common_solution.name,
    mto_common_solution.key,
    mto_common_solution.type,
    mto_common_solution.subjects,
    mto_common_solution.filter_view,
    NULL AS mto_common_milestone_key,
    (mto_solution.id IS NOT NULL) AS is_added,
    qIDs.model_plan_id
FROM mto_common_solution
-- CROSS JOIN joins the model plan id to every record, without a specific join condition
CROSS JOIN QUERIED_IDS AS qIDs
LEFT JOIN mto_solution
    ON
        mto_common_solution.key = mto_solution.mto_common_solution_key 
        AND qIDs.model_plan_id = mto_solution.model_plan_id;
        /* Note, this will send a 0 value uuid for model_plan_id instead of nil*/
