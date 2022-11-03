SELECT
    id,
    eua_id,
    idm_username,
    commonName,
    email

FROM user_account WHERE eua_id = :eua_id
