SELECT
  gen_random_uuid() AS id,
  pos.id as possible_operational_solution_id,
  'test contact' AS name,
  'test@contact.com' AS email,
  'test Role' AS role,
  '00000001-0001-0001-0001-000000000001' AS created_by, --System account
  current_timestamp AS created_dts

FROM POSSIBLE_OPERATIONAL_SOLUTION AS pos
