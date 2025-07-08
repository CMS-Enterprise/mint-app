-- Add Additional Solutions to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'NCQA';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'RMD';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'MS_FORMS';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'RESDAC_CMDS';

COMMIT;

-- Insert solutions into the mto common solution table
INSERT INTO mto_common_solution("key", "name", "type", "subjects") VALUES
('NCQA', 'National Committee for Quality Assurance (NCQA)', 'OTHER', '{CONTRACT_VEHICLES,QUALITY}'),
('RMD', 'Rapid Measure Development (RMD)', 'CONTRACTOR', '{CONTRACT_VEHICLES,QUALITY}'),
('MS_FORMS', 'Microsoft Forms (MS Forms)', 'IT_SYSTEM', '{APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS}'),
('RESDAC_CMDS', 'ResDAC CMMI Model Data Sharing Model Participation Data Initiative (ResDAC-CMDS)', 'OTHER', '{DATA}');

WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsPrimary, IsTeam) AS (
    VALUES

    ('National Committee for Quality Assurance (NCQA)', 'NCQA', 'Chautae Williamson', 'Chautae Williamson', 'Primary point of contact', TRUE, FALSE),
    ('Rapid Measure Development (RMD)', 'RMD', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Microsoft Forms (MS Forms)', 'MS_FORMS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('ResDAC CMMI Model Data Sharing Model Participation Data Initiative (ResDAC-CMDS)', 'RESDAC_CMDS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE)
)

-- Insert solution contacts into the mto common solution contact table
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
