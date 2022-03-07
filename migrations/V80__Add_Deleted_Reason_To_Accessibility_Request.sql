CREATE TYPE accessibility_request_deletion_reason AS ENUM ('INCORRECT_APPLICATION_AND_LIFECYCLE_ID', 'NO_TESTING_NEEDED', 'OTHER');

ALTER TABLE accessibility_requests ADD COLUMN deletion_reason accessibility_request_deletion_reason;
UPDATE accessibility_requests SET deletion_reason = 'OTHER' WHERE deleted_at IS NOT NULL;
