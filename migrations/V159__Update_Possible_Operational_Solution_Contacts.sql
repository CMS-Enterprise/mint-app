-- Update incorrect email for Chinelo Johnson
UPDATE possible_operational_solution_contact
SET email = 'chinelo.johnson@cms.hhs.gov',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = NOW()
WHERE email = 'echinelo.johnson@cms.hhs.gov';

-- Remove old entries from Solution Contacts
DELETE FROM possible_operational_solution_contact
WHERE NAME IN ('Nora Fleming');

-- Add new entries to Solution Contacts
WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsTeam) AS (
  VALUES
    ('4innovation (4i)', 'INNOVATION', 'Anusha Sathyanarayan', 'anusha.sathyanarayan@cms.hhs.gov', 'OIT Subject Matter Expert', FALSE),
    ('4innovation (4i)', 'INNOVATION', 'John Lumpkin', 'john.lumpkin@cms.hhs.gov', 'Experienced point of contact (supported use of 4i with multiple models)', FALSE),
    ('Accountable Care Organization - Operational System (ACO-OS)', 'ACO_OS', 'John Lumpkin', 'john.lumpkin@cms.hhs.gov', 'Experienced point of contact (supported use of 4i with multiple models)', FALSE)
)

-- Merge new entries into Solution Contacts
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
  pos.id AS possible_operational_solution_id,
  pocs.name AS name,
  pocs.email AS email,
  pocs.role AS role,
  pocs.IsTeam AS is_team,
  '00000001-0001-0001-0001-000000000001' AS created_by, --System account
  current_timestamp AS created_dts
FROM pocs
       JOIN possible_operational_solution AS pos ON CAST(pos.sol_key AS TEXT) = pocs.solutionkey;
