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


WITH pocs(SolutionName, SolutionKey, MailboxTitle, MailboxAddress, Role, IsPrimary, IsTeam, ReceiveEmails) AS (
    VALUES
    ('National Committee for Quality Assurance (NCQA)', 'NCQA', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE, TRUE),
    ('Rapid Measure Development (RMD)', 'RMD', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE, TRUE),
    ('Microsoft Forms (MS Forms)', 'MS_FORMS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE, TRUE),
    ('ResDAC CMMI Model Data Sharing Model Participation Data Initiative (ResDAC-CMDS)', 'RESDAC_CMDS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE, TRUE)
)

-- Insert solution contacts into the mto common solution contact table
INSERT INTO mto_common_solution_contact(
    id,
    mto_common_solution_key,
    mailbox_title,
    mailbox_address,
    role,
    is_primary,
    is_team,
    receive_emails,
    created_by,
    created_dts
)

SELECT
    gen_random_uuid() AS id,
    pos.key AS mto_common_solution_key,
    pocs.MailboxTitle AS mailbox_title, --noqa
    pocs.MailboxAddress AS mailbox_address,
    pocs.Role AS role, --noqa
    pocs.IsPrimary AS is_primary,
    pocs.IsTeam AS is_team,
    pocs.ReceiveEmails AS receive_emails,
    '00000001-0001-0001-0001-000000000001' AS created_by, --System account
    current_timestamp AS created_dts

FROM pocs
INNER JOIN mto_common_solution AS pos ON cast(pos.key AS TEXT) = pocs.solutionkey;
