ALTER TABLE accessibility_request_status_records ADD COLUMN eua_user_id TEXT CHECK (eua_user_id ~ '^[A-Z0-9]{4}$');
