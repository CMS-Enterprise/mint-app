UPDATE user_notification_preferences
SET dates_changed = array_append(dates_changed, 'EMAIL')
WHERE user_id IN (
  SELECT id FROM user_account WHERE email IN ('damon.watkins@cms.hhs.gov', 'sarah.musco@cms.hhs.gov')
) AND NOT 'EMAIL' = ANY(dates_changed);