CREATE TYPE DATA_EXCHANGE_APPROACH_MARKED_COMPLETE_NOTIFICATION_TYPE as enum (
  'ALL_MODELS',
  'FOLLOWED_MODELS',
  'MY_MODELS'
  );


ALTER TYPE ACTIVITY_TYPE
ADD VALUE 'DATA_EXCHANGE_APPROACH_MARKED_COMPLETE' AFTER 'NEW_MODEL_PLAN';

ALTER TABLE user_notification_preferences
  ADD COLUMN data_exchange_approach_marked_complete USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT '{}'::USER_NOTIFICATION_PREFERENCE_FLAG[],
  ADD COLUMN data_exchange_approach_marked_complete_notification_type DATA_EXCHANGE_APPROACH_MARKED_COMPLETE_NOTIFICATION_TYPE DEFAULT NULL;

COMMENT ON COLUMN user_notification_preferences.data_exchange_approach_marked_complete IS 'Notification preference for when a data exchange approach is marked complete';
