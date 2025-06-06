WITH retVal AS (
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
    RETURNING *
)
SELECT
    retVal.id,
    retVal.mto_common_solution_key,
    retVal.mailbox_title,
    retVal.mailbox_address,
    retVal.user_account_id,
    retVal.is_team,
    retVal.role,
    retVal.is_primary,
    retVal.receive_emails,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts
FROM retVal;