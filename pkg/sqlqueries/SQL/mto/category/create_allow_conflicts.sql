WITH insert_attempt AS (
    INSERT INTO mto_category (
        id,
        name,
        parent_id,
        model_plan_id,
        position,
        created_by
    )
    VALUES (
        :id,
        :name,
        :parent_id,
        :model_plan_id,
        COALESCE(
            ( -- Place category at the bottom in order
                SELECT MAX(position) 
                FROM mto_category 
                WHERE
                    model_plan_id = :model_plan_id
                    AND (parent_id = CAST(:parent_id AS UUID) OR (CAST(:parent_id AS UUID) IS NULL AND parent_id IS NULL))
            ) + 1, 
            0
        ),
        :created_by
    )
    ON CONFLICT DO NOTHING
    RETURNING * -- "RETURNING *" is fine here since we have to manually select the columns from the CTE later in this query anyways 
)

SELECT
    id, 
    name, 
    parent_id, 
    model_plan_id,
    position, 
    created_by, 
    created_dts, 
    modified_by, 
    modified_dts
FROM insert_attempt
UNION ALL
SELECT 
    id, 
    name, 
    parent_id, 
    model_plan_id,
    position, 
    created_by, 
    created_dts, 
    modified_by, 
    modified_dts
FROM mto_category
WHERE
    model_plan_id = :model_plan_id
    AND name = :name
    AND (parent_id = CAST(:parent_id AS UUID) OR (CAST(:parent_id AS UUID) IS NULL AND parent_id IS NULL))
LIMIT 1;
