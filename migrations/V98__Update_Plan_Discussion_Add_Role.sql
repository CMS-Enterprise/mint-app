CREATE TYPE DISCUSSION_USER_ROLE AS ENUM (
  'CMS_SYSTEM_SERVICE_TEAM',
  'IT_ARCHITECT',
  'LEADERSHIP',
  'MEDICARE_ADMINISTRATIVE_CONTRACTOR',
  'MINT_TEAM',
  'MODEL_IT_LEAD',
  'MODEL_TEAM',
  'SHARED_SYSTEM_MAINTAINER',
  'NONE_OF_THE_ABOVE'
  );

ALTER TABLE plan_discussion
  ADD COLUMN user_role DISCUSSION_USER_ROLE NOT NULL DEFAULT 'NONE_OF_THE_ABOVE'::DISCUSSION_USER_ROLE,
  ADD COLUMN user_role_description ZERO_STRING;

UPDATE plan_discussion SET user_role_description = 'User Role TBD';

-- Add a CHECK constraint to enforce the user_role and user_role_description relationship
-- If user_role is 'NONE_OF_THE_ABOVE', user_role_description must not be empty
ALTER TABLE plan_discussion
  ADD CONSTRAINT plan_discussion_user_role_check CHECK (
        (user_role = 'NONE_OF_THE_ABOVE' AND user_role_description IS NOT NULL)
        OR
        (user_role != 'NONE_OF_THE_ABOVE' AND (user_role_description IS NULL))
      );


ALTER TABLE discussion_reply
  ADD COLUMN user_role DISCUSSION_USER_ROLE NOT NULL DEFAULT 'NONE_OF_THE_ABOVE'::DISCUSSION_USER_ROLE,
  ADD COLUMN user_role_description ZERO_STRING;

UPDATE discussion_reply SET user_role_description = 'User Role TBD';

-- Add a CHECK constraint to enforce the user_role and user_role_description relationship
-- If user_role is 'NONE_OF_THE_ABOVE', user_role_description must not be empty
ALTER TABLE discussion_reply
  ADD CONSTRAINT plan_discussion_user_role_check CHECK (
      (user_role = 'NONE_OF_THE_ABOVE' AND user_role_description IS NOT NULL)
      OR
      (user_role != 'NONE_OF_THE_ABOVE' AND (user_role_description IS NULL))
    );
