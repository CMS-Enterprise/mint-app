ALTER TABLE user_notification_preferences
ALTER COLUMN daily_digest_complete  DROP DEFAULT,
ALTER COLUMN added_as_collaborator  DROP DEFAULT,
ALTER COLUMN tagged_in_discussion  DROP DEFAULT,
ALTER COLUMN tagged_in_discussion_reply  DROP DEFAULT,
ALTER COLUMN new_discussion_reply  DROP DEFAULT,
ALTER COLUMN model_plan_shared  DROP DEFAULT;


-- Cast all values as text array
ALTER TABLE user_notification_preferences
ALTER COLUMN daily_digest_complete  TYPE TEXT[] USING ARRAY[daily_digest_complete]::TEXT[],
ALTER COLUMN added_as_collaborator  TYPE TEXT[] USING ARRAY[added_as_collaborator]::TEXT[],
ALTER COLUMN tagged_in_discussion  TYPE TEXT[] USING ARRAY[tagged_in_discussion]::TEXT[],
ALTER COLUMN tagged_in_discussion_reply  TYPE TEXT[] USING ARRAY[tagged_in_discussion_reply]::TEXT[],
ALTER COLUMN new_discussion_reply  TYPE TEXT[] USING ARRAY[new_discussion_reply]::TEXT[],
ALTER COLUMN model_plan_shared  TYPE TEXT[] USING ARRAY[model_plan_shared]::TEXT[];


-- Drop the the existing enum type
DROP TYPE USER_NOTIFICATION_PREFERENCE_FLAG;

-- Create the new enum type
CREATE TYPE USER_NOTIFICATION_PREFERENCE_FLAG AS ENUM (
    'IN_APP', 'EMAIL'
);

-- Update all values to the default since this is not a modified feature currently
UPDATE user_notification_preferences
SET 
    daily_digest_complete = '{IN_APP, EMAIL}',
    added_as_collaborator = '{IN_APP, EMAIL}',
    tagged_in_discussion = '{IN_APP, EMAIL}',
    tagged_in_discussion_reply = '{IN_APP, EMAIL}',
    new_discussion_reply = '{IN_APP, EMAIL}',
    model_plan_shared = '{IN_APP, EMAIL}',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = now();


-- Cast all values as USER_NOTIFICATION_PREFERENCE_FLAG array
ALTER TABLE user_notification_preferences
ALTER COLUMN daily_digest_complete  TYPE USER_NOTIFICATION_PREFERENCE_FLAG[] USING daily_digest_complete::USER_NOTIFICATION_PREFERENCE_FLAG[],
ALTER COLUMN added_as_collaborator  TYPE USER_NOTIFICATION_PREFERENCE_FLAG[] USING added_as_collaborator::USER_NOTIFICATION_PREFERENCE_FLAG[],
ALTER COLUMN tagged_in_discussion  TYPE USER_NOTIFICATION_PREFERENCE_FLAG[] USING tagged_in_discussion::USER_NOTIFICATION_PREFERENCE_FLAG[],
ALTER COLUMN tagged_in_discussion_reply  TYPE USER_NOTIFICATION_PREFERENCE_FLAG[] USING tagged_in_discussion_reply::USER_NOTIFICATION_PREFERENCE_FLAG[],
ALTER COLUMN new_discussion_reply  TYPE USER_NOTIFICATION_PREFERENCE_FLAG[] USING new_discussion_reply::USER_NOTIFICATION_PREFERENCE_FLAG[],
ALTER COLUMN model_plan_shared  TYPE USER_NOTIFICATION_PREFERENCE_FLAG[] USING model_plan_shared::USER_NOTIFICATION_PREFERENCE_FLAG[];


-- Set default column values of IN_APP and Email (like ALL previously)
ALTER TABLE user_notification_preferences
ALTER COLUMN daily_digest_complete  SET DEFAULT '{IN_APP, EMAIL}',
ALTER COLUMN added_as_collaborator  SET DEFAULT '{IN_APP, EMAIL}',
ALTER COLUMN tagged_in_discussion  SET DEFAULT '{IN_APP, EMAIL}',
ALTER COLUMN tagged_in_discussion_reply  SET DEFAULT '{IN_APP, EMAIL}',
ALTER COLUMN new_discussion_reply  SET DEFAULT '{IN_APP, EMAIL}',
ALTER COLUMN model_plan_shared  SET DEFAULT '{IN_APP, EMAIL}';
