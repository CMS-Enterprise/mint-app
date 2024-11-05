WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    mto_common_milestone.name,
    mto_common_milestone.key,
    mto_common_milestone.category_name,
    mto_common_milestone.sub_category_name,
    mto_common_milestone.description,
    mto_common_milestone.facilitated_by_role,
    qIDs.model_plan_id,
    (mto_milestone.id IS NOT NULL) AS is_added
FROM mto_common_milestone
CROSS JOIN QUERIED_IDS AS qIDs
LEFT JOIN mto_milestone 
    ON
        mto_common_milestone.key = mto_milestone.mto_common_milestone_key 
        AND qIDs.model_plan_id = mto_milestone.model_plan_id;
