WITH cte_update AS (
    UPDATE model_plan
    SET model_name = :model_name,
        status = :status,
        archived = :archived,
        modified_by = :modified_by,
        modified_dts = CURRENT_TIMESTAMP
    WHERE model_plan.id = :id
    RETURNING id,
        model_name,
        archived,
        status,
        created_by,
        created_dts,
        modified_by,
        modified_dts
)

SELECT
    cte.model_name,
    cte.archived,
    cte.status,
    cte.created_by,
    cte.created_dts,
    cte.modified_by,
    cte.modified_dts,
    plan_favorite.id IS NOT NULL AS is_favorite
FROM cte_update AS cte --noqa
LEFT JOIN plan_favorite ON cte.id = plan_favorite.model_plan_id
    AND plan_favorite.user_id = cte.modified_by
