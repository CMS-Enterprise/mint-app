UPDATE user
SET
commonName = :commonName,
email = :email

WHERE eua_id = :eua_id
