-- Create the new type
CREATE TYPE ACTIVITY_TYPE AS ENUM (
    'DAILY_DIGEST_COMPLETE',
    'ADDED_AS_COLLABORATOR',
    'TAGGED_IN_DISCUSSION',
    'TAGGED_IN_DISCUSSION_REPLY',
    'NEW_DISCUSSION_REPLY',
    'MODEL_PLAN_SHARED'
);
COMMENT ON TYPE ACTIVITY_TYPE IS 'Various types of actions that happen in the application, that result in an activity record being saved, and then a subsequent notification';

CREATE TYPE USER_NOTIFICATION_PREFERENCE_FLAG AS ENUM (
    'ALL',
    'IN_APP_ONLY',
    'EMAIL_ONLY',
    'NONE'
);

COMMENT ON TYPE USER_NOTIFICATION_PREFERENCE_FLAG IS 'Notification preferences for users';


CREATE TABLE activity (
    id UUID PRIMARY KEY NOT NULL,
    actor_id UUID NOT NULL REFERENCES user_account(id), --foreign key to user table
    entity_id UUID NOT NULL,
    activity_type ACTIVITY_TYPE NOT NULL,
    meta_data JSONB NOT NULL,

    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id), --Who wrote this row, not necessarily the actor, though it could be the same
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE

);
-- Add comments to the activity table
COMMENT ON TABLE activity IS 'Table to store information about various activities performed in the system.';

COMMENT ON COLUMN activity.actor_id IS 'Identifier of the user who performed the activity (actor).';
COMMENT ON COLUMN activity.entity_id IS 'Identifier of the entity associated with the activity.';
COMMENT ON COLUMN activity.activity_type IS 'Type of activity performed (tagged in a discussion, daily digest complete etc)';
COMMENT ON COLUMN activity.meta_data IS 'Additional metadata associated with the activity, stored in a JSONB. Its type is managed in application code separate from the dtabase';


CREATE TABLE user_notification (
    id UUID PRIMARY KEY NOT NULL,
    activity_id UUID NOT NULL REFERENCES activity(id), --foreign key to user table
    user_id UUID NOT NULL REFERENCES user_account(id),
    is_read  BOOLEAN NOT NULL DEFAULT FALSE,
    in_app_sent  BOOLEAN NOT NULL,
    email_sent  BOOLEAN NOT NULL,

    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id), --Who wrote this row, not necessarily the actor, though it could be the same
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE

);

-- Add comment to the user_notification table
COMMENT ON TABLE user_notification IS 'Table to store notifications sent to users, tracking their read status and delivery methods.';

COMMENT ON COLUMN user_notification.activity_id IS 'Foreign key to the activity associated with the notification.';
COMMENT ON COLUMN user_notification.user_id IS 'Foreign key to the user account table, for the user to whom the notification is sent.';
COMMENT ON COLUMN user_notification.is_read IS 'Indicates whether the notification has been read by the user.';
COMMENT ON COLUMN user_notification.in_app_sent IS 'Indicates whether the notification will be viewable via in-app notification.';
COMMENT ON COLUMN user_notification.email_sent IS 'Indicates whether the notification has been sent via email.';


CREATE TABLE user_notification_preferences (
    id UUID PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL REFERENCES user_account(id),

    daily_digest_complete USER_NOTIFICATION_PREFERENCE_FLAG NOT NULL DEFAULT 'ALL',

    added_as_collaborator USER_NOTIFICATION_PREFERENCE_FLAG NOT NULL DEFAULT 'ALL',

    tagged_in_discussion USER_NOTIFICATION_PREFERENCE_FLAG NOT NULL DEFAULT 'ALL',

    tagged_in_discussion_reply USER_NOTIFICATION_PREFERENCE_FLAG NOT NULL DEFAULT 'ALL',

    new_discussion_reply USER_NOTIFICATION_PREFERENCE_FLAG NOT NULL DEFAULT 'ALL',

    model_plan_shared USER_NOTIFICATION_PREFERENCE_FLAG NOT NULL DEFAULT 'ALL',

    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE

);

-- Add comments to the user notification table
COMMENT ON TABLE user_notification_preferences IS 'Table to store user preferences for receiving various types of notifications.';

COMMENT ON COLUMN user_notification_preferences.user_id IS 'Foreign key to the user account table, for the user to whom the preference is for.';
COMMENT ON COLUMN user_notification_preferences.daily_digest_complete IS 'Notification preference for daily digest completion.';
COMMENT ON COLUMN user_notification_preferences.added_as_collaborator IS 'Notification preference for being added as a collaborator.';
COMMENT ON COLUMN user_notification_preferences.tagged_in_discussion IS 'Notification preference for being tagged in a discussion.';
COMMENT ON COLUMN user_notification_preferences.tagged_in_discussion_reply IS 'Notification preference for being tagged in a discussion reply.';
COMMENT ON COLUMN user_notification_preferences.new_discussion_reply IS 'Notification preference for new discussion replies.';
COMMENT ON COLUMN user_notification_preferences.model_plan_shared IS 'Notification preference for shared model plans.';


/* Enable Auditing for new table*/
SELECT audit.AUDIT_TABLE('public', 'user_notification_preferences', 'id', 'user_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);

/* Insert a record for each existing current user*/
INSERT INTO user_notification_preferences (id, user_id, created_by)
SELECT
    GEN_RANDOM_UUID() AS id, -- Generate a new UUID for each record
    id AS user_id, -- User ID from user_account table
    '00000001-0001-0001-0001-000000000001' AS created_by --System Account
FROM
    user_account;

-- TODO EASI-3295 add comments to the table
