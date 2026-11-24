ALTER TABLE user_account
ADD COLUMN is_deactivated BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN user_account.is_deactivated IS 'True when the account is deactivated in Okta / EUA. Deactivated accounts should not receive automatic email notifications.';
