ALTER TYPE ACTIVITY_TYPE
  ADD VALUE 'DATES_CHANGED' AFTER 'NEW_MODEL_PLAN';

CREATE TYPE DATES_CHANGED_NOTIFICATION_TYPE AS ENUM (
  'ALL_MODELS',
  'FOLLOWED_MODELS',
  'MY_MODELS'
);

ALTER TABLE user_notification_preferences
  ADD COLUMN dates_changed user_notification_preference_flag[] DEFAULT '{}'::user_notification_preference_flag[],
  ADD COLUMN dates_changed_notification_type DATES_CHANGED_NOTIFICATION_TYPE DEFAULT NULL;

COMMENT ON COLUMN user_notification_preferences.dates_changed IS 'Notification preference for when a date changes';
COMMENT ON COLUMN user_notification_preferences.dates_changed_notification_type IS 'Notification preference for when a date changes';
