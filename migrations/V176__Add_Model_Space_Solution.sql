-- Add MODEL_SPACE to the ENUM type
ALTER TYPE OPERATIONAL_SOLUTION_KEY ADD VALUE 'MODEL_SPACE';

COMMIT;

-- Insert MODEL_SPACE into the possible operational solution table
INSERT INTO possible_operational_solution("id", "sol_name", "sol_key", "created_by") VALUES
(41, 'Model Space', 'MODEL_SPACE', '00000001-0001-0001-0001-000000000001');


WITH poc( SolutionKey, Name, Email, Role, IsPrimary, IsTeam) AS (
    VALUES

    ('MODEL_SPACE', 'Zach Nall', 'r.nall@cms.hhs.gov', 'Product Owner', TRUE, FALSE),
    ('MODEL_SPACE', 'Curtis Naumann', 'curtis.naumann@cms.hhs.gov', 'Product Owner', FALSE, FALSE)
)

-- Insert MODEL_SPACE contacts into the possible operational solution contact table
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
    poc.name,
    poc.email,
    poc.role,
    poc.IsPrimary AS is_primary,
    poc.IsTeam AS is_team,
    '00000001-0001-0001-0001-000000000001' AS created_by, --System account
    current_timestamp AS created_dts

FROM poc
INNER JOIN possible_operational_solution AS pos ON cast(pos.sol_key AS TEXT) = poc.SolutionKey;
