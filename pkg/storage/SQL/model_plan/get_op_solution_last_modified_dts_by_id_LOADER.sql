WITH QUERIED_IDS AS (
    -- Translate the input JSON array to a table
    SELECT id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x(id UUID) --noqa
),

LATEST_DATES AS (
    SELECT
        operational_need.model_plan_id,
        GREATEST(MAX(operational_need.modified_dts), MAX(operational_need.created_dts)) AS latest_date
    FROM operational_need
    WHERE operational_need.model_plan_id IN (SELECT id FROM QUERIED_IDS)
    GROUP BY operational_need.model_plan_id

    UNION ALL

    SELECT
        operational_need.model_plan_id,
        GREATEST(MAX(operational_solution.modified_dts), MAX(operational_solution.created_dts)) AS latest_date
    FROM operational_solution
    INNER JOIN operational_need ON operational_need.id = operational_solution.operational_need_id
    WHERE operational_need.model_plan_id IN (SELECT id FROM QUERIED_IDS)
    GROUP BY operational_need.model_plan_id

    UNION ALL

    SELECT
        operational_need.model_plan_id,
        GREATEST(MAX(operational_solution_subtask.modified_dts), MAX(operational_solution_subtask.created_dts)) AS latest_date
    FROM operational_solution_subtask
    INNER JOIN operational_solution ON operational_solution.id = operational_solution_subtask.solution_id
    INNER JOIN operational_need ON operational_need.id = operational_solution.operational_need_id
    WHERE operational_need.model_plan_id IN (SELECT id FROM QUERIED_IDS)
    GROUP BY operational_need.model_plan_id

    UNION ALL

    SELECT
        operational_need.model_plan_id,
        GREATEST(MAX(plan_document_solution_link.modified_dts), MAX(plan_document_solution_link.created_dts),MAX(plan_document.created_dts), MAX(plan_document.modified_dts)) AS latest_date
    FROM plan_document_solution_link
    INNER JOIN plan_document ON plan_document.id = plan_document_solution_link.document_id
    INNER JOIN operational_solution ON operational_solution.id = plan_document_solution_link.solution_id
    INNER JOIN operational_need ON operational_need.id = operational_solution.operational_need_id
    WHERE operational_need.model_plan_id IN (SELECT id FROM QUERIED_IDS)
    GROUP BY operational_need.model_plan_id
)

SELECT
    model_plan_id,
    MAX(latest_date) AS Most_Recent_Activity_Date
FROM LATEST_DATES
GROUP BY model_plan_id;
