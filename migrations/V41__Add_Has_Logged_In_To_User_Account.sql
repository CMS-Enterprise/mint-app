ALTER TABLE user_account
ADD COLUMN has_logged_in BOOLEAN DEFAULT FALSE; --ADD Column


UPDATE user_account --Update missing information
SET has_logged_in = FALSE
WHERE has_logged_in IS NULL;

ALTER TABLE user_account
ALTER COLUMN has_logged_in SET NOT NULL; -- Add not null constraint
