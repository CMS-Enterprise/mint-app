WITH retVal AS (
    DELETE FROM mto_common_solution_contact
    WHERE id = :id
    RETURNING
        id,
        mto_common_solution_key,
        mailbox_title,
        mailbox_address,
        user_id,
        is_team,
        role,
        is_primary,
        receive_emails,
        created_by,
        created_dts,
        modified_by,
        modified_dts
)

SELECT
    retVal.id,
    retVal.mto_common_solution_key,
    retVal.mailbox_title,
    retVal.mailbox_address,
    retVal.user_id,
    retVal.is_team,
    retVal.role,
    retVal.is_primary,
    retVal.receive_emails,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts,
    COALESCE(user_account.email, retVal.mailbox_address) AS email,
    COALESCE(user_account.common_name, retVal.mailbox_title) AS name,
    user_account.username
FROM retVal
LEFT JOIN user_account ON retVal.user_id = user_account.id;
