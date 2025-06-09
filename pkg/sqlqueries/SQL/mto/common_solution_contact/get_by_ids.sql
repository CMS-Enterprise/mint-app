WITH QUERIED_IDS AS (
    /* Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[])) AS id
)
SELECT
    mto_common_solution_contact.id,
    mto_common_solution_contact.mto_common_solution_key,
    mto_common_solution_contact.mailbox_title,
    mto_common_solution_contact.mailbox_address,
    mto_common_solution_contact.user_account_id,
    mto_common_solution_contact.is_team,
    mto_common_solution_contact.role,
    mto_common_solution_contact.is_primary,
    mto_common_solution_contact.receive_emails,
    mto_common_solution_contact.created_by,
    mto_common_solution_contact.created_dts,
    mto_common_solution_contact.modified_by,
    mto_common_solution_contact.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_common_solution_contact AS contact
    ON contact.id = qIDs.id;