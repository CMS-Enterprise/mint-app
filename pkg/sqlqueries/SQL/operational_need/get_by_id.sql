SELECT
    OpNd.id,
    OpNd.model_plan_id,
    pOpNd.id AS need_type,
    pOpNd.need_name,
    pOpNd.need_key,
    pOpNd.section,
    OpNd.name_other,
    OpNd.needed,
    OpNd.created_by,
    OpNd.created_dts,
    OpNd.modified_by,
    OpNd.modified_dts
FROM
    operational_need AS OpNd
LEFT JOIN
    possible_operational_need AS pOpNd
    ON OpNd.need_type = pOpNd.id
WHERE OpNd.id = :id
