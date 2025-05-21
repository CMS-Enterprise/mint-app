-- Add CDAC to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'CDAC';

COMMIT;

-- Insert CDAC into the mto common solution table
INSERT INTO mto_common_solution("key", "name", "type", "subjects") VALUES
('CDAC', 'CMMI Data Aggregation Contract (CDAC)', 'CONTRACTOR', '{CONTRACT_VEHICLES,DATA}');

WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsPrimary, IsTeam) AS (
    VALUES

    ('CMMI Data Aggregation Contract (CDAC)', 'CDAC', 'Megha Mirchandani', 'megha.mirchandani@cms.hhs.gov', 'Contracting Officer’s Representative (COR)', TRUE, FALSE),
    ('CMMI Data Aggregation Contract (CDAC)', 'CDAC', 'William Gordon', 'william.gordon@cms.hhs.gov', 'Product Owner', FALSE, FALSE),
    ('CMMI Data Aggregation Contract (CDAC)', 'CDAC', 'Velda McGhee', 'velda.mcghee@cms.hhs.gov', 'Project Manager',FALSE, FALSE)
)

-- Insert CDAC contacts into the mto common solution contact table
INSERT INTO mto_common_solution_contact(
    id,
    mto_common_solution_key,
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
    pos.key AS mto_common_solution_key,
    pocs.name AS name, --noqa
    pocs.email,
    pocs.role AS role, --noqa
    pocs.IsPrimary AS is_primary,
    pocs.IsTeam AS is_team,
    '00000001-0001-0001-0001-000000000001' AS created_by, --System account
    current_timestamp AS created_dts

FROM pocs
INNER JOIN mto_common_solution AS pos ON cast(pos.key AS TEXT) = pocs.solutionkey;
