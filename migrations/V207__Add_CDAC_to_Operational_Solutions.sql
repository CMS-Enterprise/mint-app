-- Add CDAC to the ENUM type
ALTER TYPE OPERATIONAL_SOLUTION_KEY ADD VALUE 'CDAC';

COMMIT;

-- Insert CDAC into the possible operational solution table
INSERT INTO possible_operational_solution("id", "sol_name", "sol_key", "created_by") VALUES
(42, 'CMMI Data Aggregation Contract', 'CDAC', '00000001-0001-0001-0001-000000000001');

WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsPrimary, IsTeam) AS (
    VALUES

    ('CMMI Data Aggregation Contract', 'CDAC', 'Megha Mirchandani', 'megha.mirchandani@cms.hhs.gov', 'Contracting Officer’s Representative (COR)', TRUE, FALSE),
    ('CMMI Data Aggregation Contract', 'CDAC', 'William Gordon', 'william.gordon@cms.hhs.gov', 'Product Owner', FALSE, FALSE),
    ('CMMI Data Aggregation Contract', 'CDAC', 'Velda McGhee', 'velda.mcghee@cms.hhs.gov', 'Project Manager',FALSE, FALSE)
)

-- Insert CDAC contacts into the possible operational solution contact table
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
    pos.id AS possible_operational_solution_id,
    pocs.name AS name, --noqa
    pocs.email,
    pocs.role AS role, --noqa
    pocs.IsPrimary AS is_primary,
    pocs.IsTeam AS is_team,
    '00000001-0001-0001-0001-000000000001' AS created_by, --System account
    current_timestamp AS created_dts

FROM pocs
INNER JOIN possible_operational_solution AS pos ON cast(pos.sol_key AS TEXT) = pocs.solutionkey;
