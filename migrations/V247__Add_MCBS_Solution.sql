-- Add MCBS to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'MCBS';

COMMIT;

-- Insert MCBS into the mto common solution table
INSERT INTO mto_common_solution("id", "key", "name", "type", "subjects") VALUES
(gen_random_uuid(), 'MCBS', 'Medicare Current Beneficiary Survey (MCBS)', 'IT_SYSTEM', '{DATA}');

WITH pocs(SolutionName, SolutionKey, MailboxTitle, MailboxAddress, Role, IsPrimary, IsTeam, ReceiveEmails) AS (
    VALUES

    ('Medicare Current Beneficiary Survey (MCBS)', 'MCBS', 'MCBS Team Mailbox', 'MCBS@cms.hhs.gov', NULL, TRUE, TRUE, TRUE),
    ('Medicare Current Beneficiary Survey (MCBS)', 'MCBS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, FALSE, TRUE, TRUE)
)

-- Insert MCBS contacts into the mto common solution contact table
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
    mto_common_solution.key AS mto_common_solution_key,
    pocs.MailboxTitle AS mailbox_title,
    pocs.MailboxAddress AS mailbox_address,
    pocs.Role,
    pocs.IsPrimary AS is_primary,
    pocs.IsTeam AS is_team,
    pocs.ReceiveEmails AS receive_emails,
    '00000001-0001-0001-0001-000000000001' AS created_by, -- System account
    current_timestamp AS created_dts
FROM pocs
INNER JOIN mto_common_solution ON cast(mto_common_solution.key AS TEXT) = pocs.SolutionKey;

-- Add MCBS to DATA_TO_MONITOR and DATA_TO_SUPPORT_EVAL milestones
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('DATA_TO_MONITOR', 'MCBS');

INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('DATA_TO_SUPPORT_EVAL', 'MCBS');
