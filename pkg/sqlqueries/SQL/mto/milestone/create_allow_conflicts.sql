WITH retVal AS (
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
    retVal.id,
    retVal.model_plan_id,
    retVal.mto_common_milestone_id,
    retVal.mto_category_id,
    COALESCE(retVal.name, mto_common_milestone.name) AS "name",
    retVal.facilitated_by,
    retVal.facilitated_by_other,
    retVal.need_by,
    retVal.status,
    retVal.risk_indicator,
    retVal.is_draft,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts,
    retVal.newly_inserted
FROM retVal
LEFT JOIN mto_common_milestone ON retVal.mto_common_milestone_id = mto_common_milestone.id

UNION ALL

SELECT
    m.id,
    m.model_plan_id,
    m.mto_common_milestone_id,
    m.mto_category_id,
    COALESCE(m.name, mto_common_milestone.name) AS "name",
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
LEFT JOIN mto_common_milestone ON m.mto_common_milestone_id = mto_common_milestone.id
WHERE
    m.model_plan_id = :model_plan_id
    AND m.mto_common_milestone_id = :mto_common_milestone_id
    AND NOT EXISTS (SELECT 1 FROM retVal)
LIMIT 1;
