SELECT
    OpNd.id,
    :model_plan_id AS model_plan_id, --use a variable here
    pOpNd.id AS need_type,
    pOpNd.need_name,
    pOpNd.need_key,
    pOpNd.section,
    OpNd.name_other,
    COALESCE(OpNd.needed, FALSE) AS needed,
    COALESCE(OpNd.created_by, '00000000-0000-0000-0000-000000000000') AS created_by, -- This is UUID.NIL, the same as the UNKNOWN_USER account in the Db
    COALESCE(OpNd.created_dts, CURRENT_TIMESTAMP) AS created_dts,
    OpNd.modified_by,
    OpNd.modified_dts
FROM
    possible_operational_need AS pOpNd
LEFT JOIN operational_need AS OpNd
    ON OpNd.need_type = pOpNd.id AND OpNd.model_plan_id = :model_plan_id
WHERE OpNd.model_plan_id = :model_plan_id AND pOpNd.need_key = :need_key;
