WITH retVal AS (
    DELETE FROM key_contact
    WHERE id = :id
    RETURNING
        id,
        mailbox_title,
        mailbox_address,
        user_id,
        is_team,
        subject_area,
        subject_category_id,
        created_by,
        created_dts,
        modified_by,
        modified_dts
)

SELECT
    retVal.id,
    retVal.mailbox_title,
    retVal.mailbox_address,
    retVal.user_id,
    retVal.is_team,
    retVal.subject_area,
    retVal.subject_category_id,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts,
    COALESCE(user_account.email, retVal.mailbox_address) AS email,
    COALESCE(user_account.common_name, retVal.mailbox_title) AS name
FROM retVal
LEFT JOIN user_account ON retVal.user_id = user_account.id;
