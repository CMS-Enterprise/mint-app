SELECT
id,
eua_id,
idm_username,
commonName,
email

FROM user where eua_id = :eua_id
