WITH QUERIED_IDS AS (
    /* Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[])) AS id
)

SELECT
    contact.id,
    contact.mto_common_solution_key,
    contact.mailbox_title,
    contact.mailbox_address,
    contact.user_id,
    contact.is_team,
    contact.role,
    contact.is_primary,
    contact.receive_emails,
    contact.created_by,
    contact.created_dts,
    contact.modified_by,
    contact.modified_dts,
    COALESCE(user_account.email, contact.mailbox_address) AS email,
    COALESCE(user_account.common_name, contact.mailbox_title) AS name
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_common_solution_contact AS contact ON contact.id = qIDs.id
LEFT JOIN user_account ON contact.user_id = user_account.id;
