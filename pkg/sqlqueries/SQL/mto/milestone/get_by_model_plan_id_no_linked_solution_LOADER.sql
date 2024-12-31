WITH QIDS AS (
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

/* LEFT JOIN to see if the milestone's mto_common_milestone_key is
     found in the common link table */
LEFT JOIN mto_common_milestone_solution_link AS cLink
    ON m.mto_common_milestone_key = cLink.mto_common_milestone_key

WHERE
    /* Only milestones whose model_plan_id is in the QIDS set */
    m.model_plan_id IN (SELECT model_plan_id FROM QIDS)
    /* Exclude if there's a direct link entry (milestone_id not null) */
    AND link.milestone_id IS NULL
    /* Exclude if there's a matching common key in the cLink table */
    AND cLink.mto_common_milestone_key IS NULL;
