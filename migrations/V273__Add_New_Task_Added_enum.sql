ALTER TYPE ACTIVITY_TYPE
ADD VALUE 'NEW_TASK_ADDED' AFTER 'MTO_READY_FOR_REVIEW';

ALTER TYPE ACTIVITY_TYPE
ADD VALUE 'TASK_COMPLETED' AFTER 'NEW_TASK_ADDED';

ALTER TABLE user_notification_preferences
ADD COLUMN new_task_added USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT '{}'::USER_NOTIFICATION_PREFERENCE_FLAG[];

ALTER TABLE user_notification_preferences
ADD COLUMN task_completed USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT '{}'::USER_NOTIFICATION_PREFERENCE_FLAG[];

COMMENT ON COLUMN user_notification_preferences.new_task_added
IS 'Notification preference for when new tasks are added.';

COMMENT ON COLUMN user_notification_preferences.task_completed
IS 'Notification preference for when a task is completed.';
