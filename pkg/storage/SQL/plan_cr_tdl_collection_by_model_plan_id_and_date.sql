SELECT
    id,
    model_plan_id,
    id_number,
    date_initiated,
    title,
    note,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_cr_tdl
WHERE model_plan_id = :model_plan_id
  AND ((created_dts >= :start_date::TIMESTAMP AND  created_dts < :end_date::TIMESTAMP)
    OR (modified_dts >= :start_date::TIMESTAMP AND  modified_dts < :end_date::TIMESTAMP)
