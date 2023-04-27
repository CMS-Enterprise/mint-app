UPDATE nda_agreement
SET
    agreed = :agreed,
    agreed_dts = :agreed_dts,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE user_id = :user_id
RETURNING id,
user_id,
agreed,
agreed_dts,
created_by,
created_dts,
modified_by,
modified_dts;
