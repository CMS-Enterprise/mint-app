WITH QUERIED_IDS AS (
    /* Translate the input to a table */
    SELECT model_plan_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
      AS x("model_plan_id" UUID) -- noqa
)

SELECT
    dea.id,
    dea.model_plan_id,
    dea.high_level_overview,
    dea.new_methods,
    dea.feasibility,
    dea.participant_burden,
    dea.cmmi_impact,
    dea.additional_considerations,
    dea.created_by,
    dea.created_dts,
    dea.modified_by,
    dea.modified_dts,
    dea.status
-- TODO replace with expanded fields

FROM QUERIED_IDS AS qIDs
INNER JOIN data_exchange_approach AS dea ON dea.model_plan_id = qIDs.model_plan_id;
