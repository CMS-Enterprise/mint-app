WITH updated AS (
    UPDATE mto_common_solution_contact
    SET
        mto_common_solution_key = COALESCE(:mto_common_solution_key, mto_common_solution_key),
        mailbox_title = COALESCE(:mailbox_title, mailbox_title),
        mailbox_address = COALESCE(:mailbox_address, mailbox_address),
        user_id = COALESCE(:user_id, user_id),
        is_team = COALESCE(:is_team, is_team),
        role = :role, -- allow null
        is_primary = :is_primary,
        receive_emails = :receive_emails,
        modified_by = :modified_by,
        modified_dts = CURRENT_TIMESTAMP
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
    updated.id,
    updated.mto_common_solution_key,
    updated.mailbox_title,
    updated.mailbox_address,
    updated.user_id,
    updated.is_team,
    updated.role,
    updated.is_primary,
    updated.receive_emails,
    updated.created_by,
    updated.created_dts,
    updated.modified_by,
    updated.modified_dts,
    COALESCE(user_account.email, updated.mailbox_address) AS email,
    COALESCE(user_account.common_name, updated.mailbox_title) AS name,
    user_account.username
FROM updated
LEFT JOIN user_account ON updated.user_id = user_account.id;
