WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT
        model_plan_id,
        filter_view
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID, "filter_view" MODEL_VIEW_FILTER ) --noqa
)

SELECT
    mto_solution.id,
    mto_solution.model_plan_id,
    mto_solution.mto_common_solution_key,
    COALESCE(mto_solution.name, mto_common_solution.name) AS "name",
    COALESCE(mto_solution.type, mto_common_solution.type) AS "type",
    mto_solution.facilitated_by,
    mto_solution.needed_by,
    mto_solution.status,
    mto_solution.risk_indicator,
    mto_solution.poc_name,
    mto_solution.poc_email,
    mto_solution.created_by,
    mto_solution.created_dts,
    mto_solution.modified_by,
    mto_solution.modified_dts,
    mto_common_solution.filter_view

FROM mto_solution
INNER JOIN mto_common_solution ON mto_solution.mto_common_solution_key = mto_common_solution.key
INNER JOIN QUERIED_IDS AS qIDs
    ON (
        mto_common_solution.filter_view = qIDs.filter_view
        AND mto_solution.model_plan_id = qIDs.model_plan_id
    );
