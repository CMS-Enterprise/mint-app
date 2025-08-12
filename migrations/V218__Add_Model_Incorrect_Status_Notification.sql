ALTER TYPE ACTIVITY_TYPE
ADD VALUE 'INCORRECT_MODEL_STATUS' AFTER 'DATA_EXCHANGE_APPROACH_MARKED_COMPLETE';

CREATE TYPE INCORRECT_MODEL_STATUS_NOTIFICATION_TYPE AS ENUM (
    'ALL_MODELS',
    'FOLLOWED_MODELS',
    'MY_MODELS'
);

ALTER TABLE user_notification_preferences
ADD COLUMN incorrect_model_status USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT '{}'::USER_NOTIFICATION_PREFERENCE_FLAG[],
ADD COLUMN incorrect_model_status_notification_type INCORRECT_MODEL_STATUS_NOTIFICATION_TYPE DEFAULT NULL;

COMMENT ON COLUMN user_notification_preferences.incorrect_model_status
IS 'Notification preference for when MINT detects an incorrect model status.';
COMMENT ON COLUMN user_notification_preferences.incorrect_model_status_notification_type
IS 'Scope for incorrect model status notifications (all, followed, or my models).';
