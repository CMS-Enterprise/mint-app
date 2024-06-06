ALTER TYPE ACTIVITY_TYPE
  ADD VALUE 'DATES_CHANGED';-- AFTER 'NEW_MODEL_PLAN'; -- TODO: Remove the comment after merge of New Model Plan notif

ALTER TABLE user_notification_preferences
  ADD COLUMN dates_changed user_notification_preference_flag[] DEFAULT '{}'::user_notification_preference_flag[];

COMMENT ON COLUMN user_notification_preferences.dates_changed IS 'Notification preference for when a date changes';
