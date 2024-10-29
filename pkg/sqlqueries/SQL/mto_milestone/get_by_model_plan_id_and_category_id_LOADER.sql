WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT
        model_plan_id,
        mto_category_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID, "mto_category_id" BOOLEAN ) --noqa
),

SELECT
    mto_milestone.id,
    mto_milestone.model_plan_id,
    mto_milestone.mto_common_milestone_id,
    mto_milestone.mto_category_id,
    mto_milestone.name,
    mto_milestone.facilitated_by,
    mto_milestone.need_by,
    mto_milestone.status,
    mto_milestone.risk_indicator,
    mto_milestone.is_draft,
    mto_milestone.created_by,
    mto_milestone.created_dts,
    mto_milestone.modified_by,
    mto_milestone.modified_dts
FROM mto_milestone
INNER JOIN QUERIED_IDS AS qIDs ON mto_milestone.model_plan_id = qIDs.model_plan_id AND mto_milestone.mto_category_id = qIDs.mto_category_id;
