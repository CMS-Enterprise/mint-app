ALTER TYPE ACTIVITY_TYPE
ADD VALUE 'INCORRECT_MODEL_STATUS' AFTER 'DATA_EXCHANGE_APPROACH_MARKED_COMPLETE';

ALTER TABLE user_notification_preferences
ADD COLUMN incorrect_model_status USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT '{}'::USER_NOTIFICATION_PREFERENCE_FLAG[];

COMMENT ON COLUMN user_notification_preferences.incorrect_model_status
IS 'Notification preference for when MINT detects an incorrect model status.';
