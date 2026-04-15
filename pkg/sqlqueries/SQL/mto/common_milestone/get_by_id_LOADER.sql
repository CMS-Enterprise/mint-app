WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[]))  AS id
)

SELECT
    mto_common_milestone.id,
    mto_common_milestone.name,
    mto_common_milestone.description,
    mto_common_milestone.category_name,
    mto_common_milestone.sub_category_name,
    mto_common_milestone.facilitated_by_role,
    mto_common_milestone.facilitated_by_other,
    mto_common_milestone.section,
    mto_common_milestone.is_archived,
    -- These are fields in the table we may choose not to expose in the app
    -- mto_common_milestone.trigger_table,
    -- mto_common_milestone.trigger_col,
    -- mto_common_milestone.trigger_vals
    CAST(NULL AS UUID) AS model_plan_id,
    FALSE AS is_added,
    CAST(NULL AS UUID) AS mto_suggested_milestone_id
FROM mto_common_milestone
INNER JOIN QUERIED_IDS AS qIDs ON mto_common_milestone.id = qIDs.id;
