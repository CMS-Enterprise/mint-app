SELECT
    mto_common_solution_contact.id,
    mto_common_solution_contact.mto_common_solution_key,
    mto_common_solution_contact.mailbox_title,
    mto_common_solution_contact.mailbox_address,
    mto_common_solution_contact.user_id,
    mto_common_solution_contact.is_team,
    mto_common_solution_contact.role,
    mto_common_solution_contact.is_primary,
    mto_common_solution_contact.receive_emails,
    mto_common_solution_contact.created_by,
    mto_common_solution_contact.created_dts,
    mto_common_solution_contact.modified_by,
    mto_common_solution_contact.modified_dts,
    COALESCE(user_account.email, mto_common_solution_contact.mailbox_address) AS email,
    COALESCE(user_account.common_name, mto_common_solution_contact.mailbox_title) AS name,
    user_account.username
FROM mto_common_solution_contact
LEFT JOIN user_account ON mto_common_solution_contact.user_id = user_account.id
WHERE mto_common_solution_contact.id = :id;
