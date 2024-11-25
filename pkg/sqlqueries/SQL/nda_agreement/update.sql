UPDATE nda_agreement
SET
    v1_agreed = :v1_agreed,
    v1_agreed_dts = :v1_agreed_dts,
    v2_agreed = :v2_agreed,
    v2_agreed_dts = :v2_agreed_dts,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE user_id = :user_id
RETURNING
    id,
    user_id,
    v1_agreed,
    v1_agreed_dts,
    v2_agreed,
    v2_agreed_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
