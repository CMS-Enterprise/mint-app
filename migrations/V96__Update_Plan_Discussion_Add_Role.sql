ALTER TABLE plan_discussion
  ADD COLUMN user_role TEXT,
  ADD COLUMN user_role_description TEXT;

-- Add a CHECK constraint to enforce the user_role and user_role_description relationship
-- If user_role is 'NONE_OF_THE_ABOVE', user_role_description must not be empty
ALTER TABLE plan_discussion
  ADD CONSTRAINT user_role_check CHECK (
      (user_role = 'NONE_OF_THE_ABOVE' AND user_role_description != '' AND user_role_description IS NOT NULL)
      OR
      (user_role != 'NONE_OF_THE_ABOVE' AND (user_role_description = '' OR user_role_description IS NULL))
    );
