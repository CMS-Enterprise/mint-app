SELECT MAX(latest_date) AS Most_Recent_Activity_Date
FROM (
    SELECT GREATEST(MAX(modified_dts), MAX(created_dts)) AS latest_date
    FROM operational_need
    WHERE id = :operational_need_id

    UNION ALL

    SELECT GREATEST(MAX(modified_dts), MAX(created_dts)) AS latest_date
    FROM operational_solution
    WHERE operational_need_id = :operational_need_id

    UNION ALL

    SELECT GREATEST(MAX(modified_dts), MAX(created_dts)) AS latest_date
    FROM operational_solution_subtask
    WHERE
        solution_id IN (
            SELECT id FROM operational_solution WHERE operational_need_id = :operational_need_id
        )

    UNION ALL

    SELECT GREATEST(MAX(modified_dts), MAX(created_dts)) AS latest_date
    FROM plan_document_solution_link
    WHERE
        solution_id IN (
            SELECT id FROM operational_solution WHERE operational_need_id = :operational_need_id
        )

    UNION ALL

    SELECT GREATEST(MAX(modified_dts), MAX(created_dts)) AS latest_date
    FROM plan_document
    WHERE model_plan_id IN (
        SELECT model_plan_id FROM operational_need WHERE id = :operational_need_id
    )
) AS latest_dates;
