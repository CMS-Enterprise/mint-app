UPDATE plan_basics
SET
  model_plan_id = :model_plan_id,
  model_name = NULLIF(:model_name, ''),
  model_category = NULLIF(:model_category, ''),
  cms_center = NULLIF(:cms_center, ''),
  cmmi_group = NULLIF(:cmmi_group, ''),
  model_type = NULLIF(:model_type, ''),
  problem = NULLIF(:problem, ''),
  goal = NULLIF(:goal, ''),
  test_inventions = NULLIF(:test_inventions, ''),
  note = NULLIF(:note, ''),
  -- created_by = :created_by,
  -- created_dts = :created_dts,
  modified_by = :modified_by,
  modified_dts = :modified_dts,
  status = NULLIF(:status, '')
WHERE plan_basics.id = :id
    RETURNING
        id,
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
        ;