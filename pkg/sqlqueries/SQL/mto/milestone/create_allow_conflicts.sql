WITH insert_attempt AS (
    INSERT INTO mto_milestone(
        id,
        model_plan_id,
        mto_common_milestone_id,
        mto_category_id,
        name,
        facilitated_by,
        facilitated_by_other,
        need_by,
        status,
        risk_indicator,
        is_draft,
        created_by,
        created_dts
    )
    VALUES (
        :id,
        :model_plan_id,
        :mto_common_milestone_id,
        :mto_category_id,
        :name,
        :facilitated_by,
        :facilitated_by_other,
        :need_by,
        :status,
        :risk_indicator,
        :is_draft,
        :created_by,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (model_plan_id, mto_common_milestone_id)
    DO NOTHING
    RETURNING
        id,
        model_plan_id,
        mto_common_milestone_id,
        mto_category_id,
        name,
        facilitated_by,
        facilitated_by_other,
        need_by,
        status,
        risk_indicator,
        is_draft,
        created_by,
        created_dts,
        modified_by,
        modified_dts,
        TRUE AS newly_inserted
)

SELECT
    ia.id,
    ia.model_plan_id,
    ia.mto_common_milestone_id,
    ia.mto_category_id,
    COALESCE(ia.name, mcm.name) AS "name",
    ia.facilitated_by,
    ia.facilitated_by_other,
    ia.need_by,
    ia.status,
    ia.risk_indicator,
    ia.is_draft,
    ia.created_by,
    ia.created_dts,
    ia.modified_by,
    ia.modified_dts,
    ia.newly_inserted
FROM insert_attempt ia
LEFT JOIN mto_common_milestone mcm ON ia.mto_common_milestone_id = mcm.id

UNION ALL

SELECT
    m.id,
    m.model_plan_id,
    m.mto_common_milestone_id,
    m.mto_category_id,
    COALESCE(m.name, mcm.name) AS "name",
    m.facilitated_by,
    m.facilitated_by_other,
    m.need_by,
    m.status,
    m.risk_indicator,
    m.is_draft,
    m.created_by,
    m.created_dts,
    m.modified_by,
    m.modified_dts,
    FALSE AS newly_inserted
FROM mto_milestone m
LEFT JOIN mto_common_milestone mcm ON m.mto_common_milestone_id = mcm.id
WHERE
    m.model_plan_id = :model_plan_id
    AND m.mto_common_milestone_id = :mto_common_milestone_id
    AND NOT EXISTS (SELECT 1 FROM insert_attempt)
LIMIT 1;
