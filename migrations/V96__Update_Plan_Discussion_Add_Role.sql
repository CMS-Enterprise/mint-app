ALTER TABLE plan_discussion
  ADD COLUMN user_role TEXT,
  ADD COLUMN user_role_description TEXT;

-- Create a trigger function to enforce the condition
CREATE OR REPLACE FUNCTION check_user_role_description()
  RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_role != 'NONE_OF_THE_ABOVE' OR NEW.user_role IS NULL THEN
    NEW.user_role_description := '';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that calls the function before any insert or update
CREATE TRIGGER check_user_role_description_trigger
  BEFORE INSERT OR UPDATE ON plan_discussion
  FOR EACH ROW EXECUTE PROCEDURE check_user_role_description();

-- Add a CHECK constraint to enforce user_role_description can only be set when user_role is 'NONE_OF_THE_ABOVE'
ALTER TABLE plan_discussion
  ADD CONSTRAINT user_role_check CHECK (
      (user_role = 'NONE_OF_THE_ABOVE' AND user_role_description != '')
      OR
      (user_role != 'NONE_OF_THE_ABOVE' AND (user_role_description = '' OR user_role_description IS NULL))
    );
