WITH retVal AS (
    INSERT INTO mto_milestone(
        id,
        model_plan_id,
        mto_common_milestone_key,
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
        :mto_common_milestone_key,
        :mto_category_id,
        :name,
        :facilitated_by,
        :facilitated_by_other,
        :need_by,
        :status,
        :risk_indicator,
        :is_draft,
        :created_by,
        COALESCE(:created_dts, CURRENT_TIMESTAMP)
    )
    ON CONFLICT (model_plan_id, mto_common_milestone_key) 
    DO UPDATE SET
    modified_dts = CURRENT_TIMESTAMP,
    modified_by = EXCLUDED.created_by
    RETURNING
        id,
        model_plan_id,
        mto_common_milestone_key,
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
        -- Indicate whether this was newly inserted or already existed
        CASE WHEN xmax = 0 THEN TRUE ELSE FALSE END AS newly_inserted
)

SELECT
    retVal.id,
    retVal.model_plan_id,
    retVal.mto_common_milestone_key,
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
LEFT JOIN mto_common_milestone ON retVal.mto_common_milestone_key = mto_common_milestone.key;
