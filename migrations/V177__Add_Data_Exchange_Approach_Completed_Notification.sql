ALTER TYPE ACTIVITY_TYPE
ADD VALUE 'DATA_EXCHANGE_APPROACH_COMPLETED' AFTER 'NEW_MODEL_PLAN';

ALTER TABLE user_notification_preferences
ADD COLUMN data_exchange_approach_completed USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT '{}'::USER_NOTIFICATION_PREFERENCE_FLAG[];

COMMENT ON COLUMN user_notification_preferences.data_exchange_approach_completed IS 'Notification preference for when a data exchange approach is completed';
