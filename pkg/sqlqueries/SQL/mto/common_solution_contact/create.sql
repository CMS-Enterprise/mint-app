INSERT INTO mto_common_solution_contact (
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
    modified_dts
) VALUES (
    :id,
    :mto_common_solution_key,
    :mailbox_title,
    :mailbox_address,
    :user_account_id,
    :is_team,
    :role,
    :is_primary,
    :receive_emails,
    :created_by,
    :created_dts,
    :modified_by,
    :modified_dts
)
RETURNING *;
