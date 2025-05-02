WITH QUERIED_IDS AS (
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[])) AS model_plan_id
)

SELECT
    m.id,
    m.model_plan_id,
    m.mto_common_milestone_key,
    m.mto_category_id,
    COALESCE(m.name, cm.name) AS name,
    m.facilitated_by,
    m.need_by,
    m.status,
    m.risk_indicator,
    m.is_draft,
    m.created_by,
    m.created_dts,
    m.modified_by,
    m.modified_dts
FROM mto_milestone AS m
/* Fallback name from mto_common_milestone if m.name is null */
LEFT JOIN mto_common_milestone AS cm
    ON m.mto_common_milestone_key = cm.key

/* LEFT JOIN to see if this milestone is directly linked to any solution */
LEFT JOIN mto_milestone_solution_link AS link
    ON m.id = link.milestone_id

INNER JOIN QUERIED_IDS AS qIDs ON m.model_plan_id = qIDs.model_plan_id AND link.milestone_id IS NULL
