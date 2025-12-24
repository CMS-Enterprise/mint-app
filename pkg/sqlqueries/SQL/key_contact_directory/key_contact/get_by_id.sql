SELECT
    key_contact.id,
    key_contact.mailbox_title,
    key_contact.mailbox_address,
    key_contact.user_id,
    key_contact.subject_area,
    key_contact.subject_category_id,
    key_contact.created_by,
    key_contact.created_dts,
    key_contact.modified_by,
    key_contact.modified_dts,
    COALESCE(user_account.email, key_contact.mailbox_address) AS email,
    COALESCE(user_account.common_name, key_contact.mailbox_title) AS name
FROM key_contact
LEFT JOIN user_account ON key_contact.user_id = user_account.id
WHERE key_contact.id = :id;
