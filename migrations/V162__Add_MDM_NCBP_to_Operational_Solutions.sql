-- Add MDM-NCBP to the ENUM type
ALTER TYPE OPERATIONAL_SOLUTION_KEY ADD VALUE 'MDM_NCBP';

COMMIT;

-- Insert MDM-NCBP into the possible operational solution table
INSERT INTO possible_operational_solution("id", "sol_name", "sol_key", "created_by") VALUES
(40, 'Master Data Management for Non-Claims Based Payments', 'MDM_NCBP', '00000001-0001-0001-0001-000000000001');

WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsPrimary, IsTeam) AS (
  VALUES

('Master Data Management for Non-Claims Based Payments', 'MDM_NCBP', 'Celia Shaunessy', 'celia.shaunessy@cms.hhs.gov', 'CMMI/BSG Point of Contact', TRUE, FALSE),
('Master Data Management for Non-Claims Based Payments', 'MDM_NCBP', 'Glenn Eyler', 'glenn.eyler@cms.hhs.gov', 'OIT Government Task Lead', FALSE, FALSE),
('Master Data Management for Non-Claims Based Payments', 'MDM_NCBP', 'Luiz Lee', 'luiz.lee1@cms.hhs.gov', 'Solutions Architect',FALSE, FALSE),
('Master Data Management for Non-Claims Based Payments', 'MDM_NCBP', 'Sameera Gudipati', 'sameera.gudipati1@cms.hhs.gov', 'OIT Point of Contact',FALSE, FALSE)
)

-- Insert MDM-NCBP contacts into the possible operational solution contact table
INSERT INTO possible_operational_solution_contact(
    id,
    possible_operational_solution_id,
    name,
    email,
    role,
    is_primary,
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
  pocs.IsPrimary as is_primary,
  pocs.IsTeam as is_team,
  '00000001-0001-0001-0001-000000000001' AS created_by, --System account
  current_timestamp AS created_dts

FROM pocs
JOIN possible_operational_solution pos on CAST(pos.sol_key as TEXT) = pocs.solutionkey;

-- Link solution as a default for the operational need make non-claims based payments
SELECT CREATE_POSSIBLE_NEED_SOLUTION_LINK(
  'MAKE_NON_CLAIMS_BASED_PAYMENTS'::OPERATIONAL_NEED_KEY,
  '{MDM_NCBP}'::OPERATIONAL_SOLUTION_KEY[]
);
