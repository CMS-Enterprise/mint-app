UPDATE user_account
SET is_assessment = :is_assessment
WHERE id = :id
RETURNING
    id,
    username,
    is_euaid,
    common_name,
    locale,
    email,
    given_name,
    family_name,
    zone_info,
    has_logged_in,
    is_assessment;
