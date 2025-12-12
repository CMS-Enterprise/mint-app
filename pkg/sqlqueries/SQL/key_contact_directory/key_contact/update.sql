WITH updated AS (
    UPDATE key_contact
    SET
        mailbox_title = COALESCE(:mailbox_title, mailbox_title),
        subject_area = COALESCE(:subject_area, subject_area),
        subject_category_id = COALESCE(:subject_category_id, subject_category_id),
        modified_by = :modified_by,
        modified_dts = CURRENT_TIMESTAMP
    WHERE id = :id
    RETURNING
        id,
        mailbox_title,
        mailbox_address,
        user_id,
        subject_area,
        subject_category_id,
        created_by,
        created_dts,
        modified_by,
        modified_dts
)

SELECT
    updated.id,
    updated.mailbox_title,
    updated.mailbox_address,
    updated.user_id,
    updated.subject_area,
    updated.subject_category_id,
    updated.created_by,
    updated.created_dts,
    updated.modified_by,
    updated.modified_dts,
    COALESCE(user_account.email, updated.mailbox_address) AS email,
    COALESCE(user_account.common_name, updated.mailbox_title) AS name
FROM updated
LEFT JOIN user_account ON updated.user_id = user_account.id;
