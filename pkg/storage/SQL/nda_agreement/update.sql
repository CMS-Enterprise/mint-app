UPDATE nda_agreement
SET
    v2_agreed = :v2_agreed,
    agreed_dts = :agreed_dts,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE user_id = :user_id
RETURNING id,
user_id,
v2_agreed,
agreed_dts,
created_by,
created_dts,
modified_by,
modified_dts;
