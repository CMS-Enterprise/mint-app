SELECT
    OpNd.id,
    :model_plan_id AS model_plan_id, --use a variable here
    pOpNd.id AS need_type,
    pOpNd.name AS name,
    pOpNd.key AS key,
    OpNd.need_other,
    COALESCE(OpNd.needed, FALSE) AS needed,
    COALESCE(OpNd.created_by, 'NULL') AS created_by,
    COALESCE(OpNd.created_dts, CURRENT_TIMESTAMP) AS created_dts,
    OpNd.modified_by,
    OpNd.modified_dts
FROM
    possible_operational_need AS pOpNd
LEFT JOIN operational_need AS OpNd ON OpNd.need_type = pOpNd.id AND OpND.model_plan_id = :model_plan_id

UNION
SELECT
    OpNd.id,
    OpNd.model_plan_id, --use a variable here
    OpNd.need_type,
    NULL AS name,
    NULL AS key,
    OpNd.name_other,
    OpNd.needed,
    OpNd.created_by,
    OpNd.created_dts,
    OpNd.modified_by,
    OpNd.modified_dts
FROM
    operational_need AS OpNd
WHERE OpND.need_type IS NULL
    AND OpNd.model_plan_id = :model_plan_id
ORDER BY need_type ASC
