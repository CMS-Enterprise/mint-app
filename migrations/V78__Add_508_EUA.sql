ALTER TABLE accessibility_requests ADD COLUMN eua_user_id TEXT NOT NULL DEFAULT '0000' CHECK (eua_user_id ~ '^[A-Z0-9]{4}$');
