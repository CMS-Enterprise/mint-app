SELECT         id,
               model_plan_id,
               model_name,
               model_category,
               cms_center,
               cmmi_group,
               model_type,
               problem,
               goal,
               test_inventions,
               note,
               created_by,
               created_dts,
               modified_by,
               modified_dts,
               status
FROM plan_basics
WHERE id = :id