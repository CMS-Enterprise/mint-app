-- Add waiver assessment survey completion notification activity type.
-- NOTE: PostgreSQL enum values cannot be referenced as literals in the same transaction they are added,
-- so any follow-on usage of 'WAIVER_ASSESSMENT_SURVEY_MARKED_COMPLETE' must be in a later migration.
ALTER TYPE ACTIVITY_TYPE ADD VALUE IF NOT EXISTS 'WAIVER_ASSESSMENT_SURVEY_MARKED_COMPLETE' AFTER 'IDDOC_QUESTIONNAIRE_COMPLETED';

-- Notification preference type scoping waiver survey completion alerts.
CREATE TYPE WAIVER_ASSESSMENT_SURVEY_MARKED_COMPLETE_NOTIFICATION_TYPE AS ENUM (
    'ALL_MODELS',
    'FOLLOWED_MODELS',
    'MY_MODELS'
);

ALTER TABLE user_notification_preferences
ADD COLUMN waiver_assessment_survey_marked_complete USER_NOTIFICATION_PREFERENCE_FLAG[] DEFAULT '{}'::USER_NOTIFICATION_PREFERENCE_FLAG[],
ADD COLUMN waiver_assessment_survey_marked_complete_notification_type WAIVER_ASSESSMENT_SURVEY_MARKED_COMPLETE_NOTIFICATION_TYPE DEFAULT NULL;

COMMENT ON COLUMN user_notification_preferences.waiver_assessment_survey_marked_complete IS 'Notification preference for when a waiver assessment survey is marked complete.';
COMMENT ON COLUMN user_notification_preferences.waiver_assessment_survey_marked_complete_notification_type IS 'Notification preference type for when a waiver assessment survey is marked complete.';
