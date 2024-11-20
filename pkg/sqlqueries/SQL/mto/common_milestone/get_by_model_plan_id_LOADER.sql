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
    mto_common_milestone.section,
    -- These are fields in the table we may choose not to expose in the app
    -- mto_common_milestone.trigger_table,
    -- mto_common_milestone.trigger_col,
    -- mto_common_milestone.trigger_vals
    qIDs.model_plan_id,
    (mto_milestone.id IS NOT NULL) AS is_added
FROM mto_common_milestone
-- CROSS JOIN joins the model plan id to every record, without a specific join condition
CROSS JOIN QUERIED_IDS AS qIDs
LEFT JOIN mto_milestone 
    ON
        mto_common_milestone.key = mto_milestone.mto_common_milestone_key 
        AND qIDs.model_plan_id = mto_milestone.model_plan_id;
        /* Note, this will send a 0 value uuid for model_plan_id instead of nil*/
