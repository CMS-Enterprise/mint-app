SELECT
    id,
    username,
    is_euaid,
    common_name,
    locale,
    email,
    given_name,
    family_name,
    zone_info

FROM user_account WHERE username = :username
