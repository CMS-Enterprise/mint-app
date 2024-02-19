-- Create the new type
CREATE TYPE ACTIVITY_TYPE AS ENUM (
    'DAILY_DIGEST_COMPLETE',
    'ADDED_AS_COLLABORATOR',
    'TAGGED_IN_DISCUSSION',
    'TAGGED_IN_DISCUSSION_REPLY',
    'NEW_DISCUSSION_REPLY',
    'MODEL_PLAN_SHARED'
);

CREATE TYPE USER_NOTIFICATION_PREFERENCE_FLAG AS ENUM (
    'ALL',
    'IN_APP_ONLY',
    'EMAIL_ONLY',
    'NONE'
);


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
