WITH retVal AS (
    UPDATE mto_milestone
    SET 
        mto_category_id = :mto_category_id,
        name= :name,
        facilitated_by= :facilitated_by,
        need_by= :need_by,
        status= :status,
        risk_indicator= :risk_indicator,
        is_draft= :is_draft,
        modified_by= :modified_by,
        modified_dts=CURRENT_TIMESTAMP
    WHERE mto_milestone.id= :id
    RETURNING
    id,
    model_plan_id,
    mto_common_milestone_id,
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
    retVal.mto_common_milestone_id,
    retVal.mto_category_id,
    COALESCE(retVal.name, mto_common_milestone.name) AS "name",
    mto_common_milestone.key,
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
LEFT JOIN mto_common_milestone ON retVal.mto_common_milestone_id = mto_common_milestone.id
