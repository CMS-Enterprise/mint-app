-- Remove Hung Van and Yolanda Villanova as Solution Contacts
DELETE FROM possible_operational_solution_contact
WHERE NAME IN ('Hung Van', 'Yolanda Villanova');


WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsTeam) AS (
    VALUES
    ('Centralized Data Exchange', 'CDX', 'Ray Lofton', 'alton.lofton@cms.hhs.gov', 'Interim Product Owner', FALSE)
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
    pos.id AS possible_operational_solution_id,
    pocs.name AS name,
    pocs.email AS email,
    pocs.role AS role,
    pocs.IsTeam AS is_team,
    '00000001-0001-0001-0001-000000000001' AS created_by, --System account
    current_timestamp AS created_dts
FROM pocs
JOIN possible_operational_solution AS pos ON CAST(pos.sol_key AS TEXT) = pocs.solutionkey;
