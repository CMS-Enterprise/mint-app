WITH retVal AS (
    INSERT INTO mto_milestone(
        id,
        model_plan_id,
        mto_common_milestone_key,
        mto_category_id,
        name,
        facilitated_by,
        need_by,
        status,
        risk_indicator,
        is_draft,
        created_by
    )
    VALUES (
        :id,
        :model_plan_id,
        :mto_common_milestone_key,
        :mto_category_id,
        :name,
        :facilitated_by,
        :need_by,
        :status,
        :risk_indicator,
        :is_draft,
        :created_by
    )
    RETURNING
    id,
    model_plan_id,
    mto_common_milestone_key,
    mto_category_id,
    name,
    facilitated_by,
    need_by,
    status,
    risk_indicator,
    is_draft,
    created_by,
    created_dts,
    modified_by,
    modified_dts
)

SELECT

    retVal.id,
    retVal.model_plan_id,
    retVal.mto_common_milestone_key,
    retVal.mto_category_id,
    COALESCE(retVal.name, mto_common_milestone.name) AS "name",
    retVal.facilitated_by,
    retVal.need_by,
    retVal.status,
    retVal.risk_indicator,
    retVal.is_draft,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts
FROM retVal
LEFT JOIN mto_common_milestone ON retVal.mto_common_milestone_key = mto_common_milestone.key
