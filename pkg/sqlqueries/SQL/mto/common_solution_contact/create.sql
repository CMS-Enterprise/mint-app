WITH inserted AS (
    INSERT INTO mto_common_solution_contact (
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
    ) VALUES (
        :id,
        :mto_common_solution_key,
        :mailbox_title,
        :mailbox_address,
        :user_id,
        :is_team,
        :role,
        :is_primary,
        :receive_emails,
        :created_by,
        :created_dts,
        :modified_by,
        :modified_dts
    )
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
    inserted.id,
    inserted.mto_common_solution_key,
    inserted.mailbox_title,
    inserted.mailbox_address,
    inserted.user_id,
    inserted.is_team,
    inserted.role,
    inserted.is_primary,
    inserted.receive_emails,
    inserted.created_by,
    inserted.created_dts,
    inserted.modified_by,
    inserted.modified_dts,
    COALESCE(user_account.email, inserted.mailbox_address) AS email,
    COALESCE(user_account.common_name, inserted.mailbox_title) AS name
FROM inserted
LEFT JOIN user_account ON inserted.user_id = user_account.id;
