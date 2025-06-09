UPDATE mto_common_solution_contact
SET
    mto_common_solution_key = :mto_common_solution_key,
    mailbox_title = :mailbox_title,
    mailbox_address = :mailbox_address,
    user_account_id = :user_account_id,
    is_team = :is_team,
    role = :role,
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
    user_account_id,
    is_team,
    role,
    is_primary,
    receive_emails,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
