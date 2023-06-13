ALTER TABLE plan_discussion
  ADD COLUMN user_role zero_string DEFAULT 'NONE_OF_THE_ABOVE';

UPDATE plan_discussion
SET user_role = 'NONE_OF_THE_ABOVE'
WHERE user_role IS NULL;
