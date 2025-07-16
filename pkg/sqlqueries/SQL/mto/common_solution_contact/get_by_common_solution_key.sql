WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:keys AS MTO_COMMON_SOLUTION_KEY[]))  AS "key"
)

SELECT
    posc.id,
    posc.mto_common_solution_key,
    posc.mailbox_title,
    posc.mailbox_address,
    posc.user_id,
    posc.is_team,
    posc.role,
    posc.is_primary,
    posc.receive_emails,
    posc.created_by,
    posc.created_dts,
    posc.modified_by,
    posc.modified_dts,
    COALESCE(user_account.email, posc.mailbox_address) AS email,
    COALESCE(user_account.common_name, posc.mailbox_title) AS name
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_common_solution_contact AS posc ON posc.mto_common_solution_key = qIDs.key
LEFT JOIN user_account ON posc.user_id = user_account.id;
