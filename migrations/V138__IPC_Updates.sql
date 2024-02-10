/* Remove relevant points of contact */
WITH poc_solkeys_to_remove(SolutionKey) AS (
  VALUES('IPC')
),
     pocs_to_remove(POCName) AS (
       VALUES('Sue Nonemaker'),
             ('Philip Tennant')
     )
DELETE FROM possible_operational_solution_contact
WHERE possible_operational_solution_id IN (
  SELECT id
  FROM possible_operational_solution
  WHERE CAST(sol_key as TEXT) IN (
    SELECT SolutionKey
    FROM poc_solkeys_to_remove
  )
)
  AND name = ANY(
  SELECT POCName
  FROM pocs_to_remove
);

/* Set up new POCs */
WITH pocs(
          SolutionName,
          SolutionKey,
          Name,
          Email,
          Role,
          IsTeam
  ) AS (
  VALUES (
           'Innovation Payment Contractor (IPC)',
           'IPC',
           'Alistair Quatre',
           'alistair.quatre@cms.hhs.gov',
           'Subject Matter Expert',
           FALSE
         ),
         (
           'Innovation Payment Contractor (IPC)',
           'IPC',
           'Brandon Cooper',
           'brandon.cooper@cms.hhs.gov',
           'Subject Matter Expert',
           FALSE
         )
)
INSERT INTO possible_operational_solution_contact(
  id,
  possible_operational_solution_id,
  name,
  email,
  role,
  is_team,
  created_by,
  created_dts
)
SELECT gen_random_uuid() AS id,
       pos.id as possible_operational_solution_id,
       pocs.name AS name,
       pocs.email AS email,
       pocs.role AS role,
       pocs.IsTeam as is_team,
       '00000001-0001-0001-0001-000000000001' AS created_by, --System account
       current_timestamp AS created_dts
FROM pocs
       JOIN possible_operational_solution pos on CAST(pos.sol_key as TEXT) = pocs.solutionkey
