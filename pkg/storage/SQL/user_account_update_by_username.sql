UPDATE user_account
SET
    commonName = :commonName,
    locale = :locale,
    email = :email,
    given_name = :given_name,
    family_name = :family_name,
    zone_info = :zone_info

WHERE username = :username
