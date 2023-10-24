/* Entirely clear out the Solution's POCs so we can determine the insertion order easily */
WITH pocs_to_remove(SolutionKey) AS (VALUES
  ('CBOSC')
)
DELETE FROM possible_operational_solution_contact WHERE possible_operational_solution_id IN (SELECT id FROM possible_operational_solution WHERE CAST(sol_key as TEXT) IN (SELECT SolutionKey FROM pocs_to_remove));

/* Set up new POCs */
WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsTeam) AS (VALUES
  ('Consolidated Business Operations Support Center', 'CBOSC', 'Keir Shine', 'keir.shine@cms.hhs.gov', 'CBOSC Co-Lead', FALSE),
  ('Consolidated Business Operations Support Center', 'CBOSC', 'Don Rocker', 'don.rocker1@cms.hhs.gov', 'Operations and Management Lead', FALSE),
  ('Consolidated Business Operations Support Center', 'CBOSC', 'CBOSC Team', 'cmmi-omteam@cms.hhs.gov', NULL, TRUE)
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

SELECT
  gen_random_uuid() AS id,
  pos.id as possible_operational_solution_id,
  pocs.name AS name,
  pocs.email AS email,
  pocs.role AS role,
  pocs.IsTeam as is_team,
  '00000001-0001-0001-0001-000000000001' AS created_by, --System account
  current_timestamp AS created_dts

FROM pocs
JOIN possible_operational_solution pos on CAST(pos.sol_key as TEXT) = pocs.solutionkey
