INSERT INTO user_account
(
    id,
    eua_id,
    idm_username,
    common_name,
    email
)
VALUES (
    :id,
    :eua_id,
    :idm_username,
    :common_name,
    :email
)
RETURNING
id,
eua_id,
idm_username,
common_name,
email;
