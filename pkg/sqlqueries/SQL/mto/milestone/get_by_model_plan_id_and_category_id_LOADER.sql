WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT
        model_plan_id,
        mto_category_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID, "mto_category_id" UUID ) --noqa
)

SELECT
    mto_milestone.id,
    mto_milestone.model_plan_id,
    mto_milestone.mto_common_milestone_key,
    mto_milestone.mto_category_id,
    COALESCE(mto_milestone.name, mto_common_milestone.name) AS "name",
    mto_milestone.description,
    mto_milestone.responsible_component,
    mto_milestone.facilitated_by,
    mto_milestone.facilitated_by_other,
    mto_milestone.assigned_to,
    mto_milestone.need_by,
    mto_milestone.status,
    mto_milestone.risk_indicator,
    mto_milestone.is_draft,
    mto_milestone.created_by,
    mto_milestone.created_dts,
    mto_milestone.modified_by,
    mto_milestone.modified_dts
FROM mto_milestone
INNER JOIN QUERIED_IDS AS qIDs
    ON
        mto_milestone.model_plan_id = qIDs.model_plan_id 
        AND (
            mto_milestone.mto_category_id = qIDs.mto_category_id -- match null values
            OR (mto_milestone.mto_category_id IS NULL AND qIDs.mto_category_id = '00000000-0000-0000-0000-000000000000')
        )
LEFT JOIN mto_common_milestone ON mto_milestone.mto_common_milestone_key = mto_common_milestone.key;
