SELECT
  id,
  milestone_id,
  solution_id,
  created_by,
  created_dts,
  modified_by,
  modified_dts
FROM mto_milestone_solution_link
WHERE milestone_id = :milestone_id;