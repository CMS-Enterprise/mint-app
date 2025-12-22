WITH inserted AS (
    INSERT INTO key_contact (
        id,
        mailbox_title,
        mailbox_address,
        user_id,
        subject_area,
        subject_category_id,
        created_by
    ) VALUES (
        :id,
        :mailbox_title,
        :mailbox_address,
        :user_id,
        :subject_area,
        :subject_category_id,
        :created_by
    )
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
    inserted.id,
    inserted.mailbox_title,
    inserted.mailbox_address,
    inserted.user_id,
    inserted.subject_area,
    inserted.subject_category_id,
    inserted.created_by,
    inserted.created_dts,
    inserted.modified_by,
    inserted.modified_dts,
    COALESCE(user_account.email, inserted.mailbox_address) AS email,
    COALESCE(user_account.common_name, inserted.mailbox_title) AS name
FROM inserted
LEFT JOIN user_account ON inserted.user_id = user_account.id;
