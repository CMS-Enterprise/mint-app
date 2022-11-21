SELECT
    id,
    eua_id,
    idm_username,
    common_name,
    email

FROM user_account WHERE eua_id = :eua_id
