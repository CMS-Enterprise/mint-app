WITH model_plan_ids (id, model_plan_id) AS (
    SELECT
        audit.change.id,
        COALESCE(
            CASE
                WHEN audit.change.table_id IN (2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14)
                    THEN audit.change.foreign_key
            END,
            CASE audit.change.table_id = 1
                WHEN TRUE
                    THEN audit.change.primary_key
            END,
            CASE
                WHEN audit.change.table_id = 6
                    THEN (
                        SELECT pd.model_plan_id
                        FROM discussion_reply AS dr
                        INNER JOIN plan_discussion AS pd ON dr.discussion_id = pd.id
                        WHERE dr.id = audit.change.primary_key
                    )
            END,
            CASE
                WHEN audit.change.table_id = 15
                    THEN (
                        SELECT onr.model_plan_id
                        FROM operational_solution AS os
                        INNER JOIN operational_need AS onr ON os.operational_need_id = onr.id
                        WHERE os.id = audit.change.primary_key
                    )
            END,
            CASE
                WHEN audit.change.table_id = 16
                    THEN (
                        SELECT onr.model_plan_id
                        FROM operational_solution_subtask AS oss
                        INNER JOIN operational_solution AS os ON oss.solution_id = os.id
                        INNER JOIN operational_need AS onr ON os.operational_need_id = onr.id
                        WHERE oss.id = audit.change.primary_key
                    )
            END,
            CASE
                WHEN audit.change.table_id = 17
                    THEN (
                        SELECT onr.model_plan_id
                        FROM plan_document_solution_link AS pds
                        INNER JOIN operational_solution AS os ON pds.solution_id = os.id
                        INNER JOIN operational_need AS onr ON os.operational_need_id = onr.id
                        WHERE pds.id = audit.change.primary_key
                    )
            END
        ) AS derived_model_plan_id
    FROM audit.change
    WHERE
        audit.change.table_id IN
        (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17)
)

SELECT
    audit.change.id,
    audit.change.table_id,
    audit.change.primary_key,
    audit.change.foreign_key,
    audit.change.action,
    CAST(audit.change.fields AS TEXT)                                                        AS fields_data,
    audit.change.modified_dts,
    CAST(ROW_TO_JSON(user_account.*) AS TEXT)                                                AS modified_by,
    CONCAT(CAST(audit.change.table_id AS TEXT), '_', CAST(audit.change.primary_key AS TEXT)) AS guid,
    model_plan_ids.model_plan_id
FROM audit.change
LEFT JOIN user_account ON audit.change.modified_by = user_account.id
LEFT JOIN model_plan_ids ON audit.change.id = model_plan_ids.id
WHERE audit.change.id > :sql_last_value;
