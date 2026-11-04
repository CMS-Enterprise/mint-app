ALTER TABLE user_notification_preferences
ADD COLUMN model_follower_update USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT ARRAY['IN_APP', 'EMAIL']::USER_NOTIFICATION_PREFERENCE_FLAG[];

COMMENT ON COLUMN user_notification_preferences.model_follower_update IS 'Notification preference for when a model the user follows sends an update message to its followers';
