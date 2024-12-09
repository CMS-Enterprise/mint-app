WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:mto_solution_ids AS UUID[])) AS mto_solution_id
)

SELECT
    mto_milestone.id,
    mto_milestone.model_plan_id,
    mto_milestone.mto_common_milestone_key,
    mto_milestone.mto_category_id,
    COALESCE(mto_milestone.name, mto_common_milestone.name) AS "name",
    mto_milestone.facilitated_by,
    mto_milestone.need_by,
    mto_milestone.status,
    mto_milestone.risk_indicator,
    mto_milestone.is_draft,
    mto_milestone.created_by,
    mto_milestone.created_dts,
    mto_milestone.modified_by,
    mto_milestone.modified_dts,
    link.solution_id
FROM mto_milestone_solution_link AS link
INNER JOIN QUERIED_IDS AS qIDs
    ON link.solution_id = qIDs.mto_solution_id
INNER JOIN mto_milestone
    ON mto_milestone.id = link.milestone_id
LEFT JOIN mto_common_milestone
    ON mto_milestone.mto_common_milestone_key = mto_common_milestone.key;
