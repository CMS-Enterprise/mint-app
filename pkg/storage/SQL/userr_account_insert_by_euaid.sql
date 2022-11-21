INSERT INTO user_account
(
    id,
    eua_id,
    idm_username,
    commonname,
    email
)
VALUES (
    :id,
    :eua_id,
    :idm_username,
    :commonname,
    :email
)
RETURNING
id,
eua_id,
idm_username,
commonname,
email;
