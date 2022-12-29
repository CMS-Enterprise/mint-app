UPDATE user_account
SET
    commonName = :commonName,
    locale = :locale,
    email = :email,
    given_name = :given_name,
    family_name = :family_name,
    zone_info = :zone_info,
    has_logged_in = :has_logged_in

WHERE username = :username
