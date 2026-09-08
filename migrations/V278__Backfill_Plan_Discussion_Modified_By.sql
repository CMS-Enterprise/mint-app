-- V277 (Add_Discussion_Topic) backfilled the new topic column without setting modified_by/modified_dts,
-- so any plan_discussion row that had never been explicitly modified was left with modified_by NULL.
-- audit.change.modified_by is NOT NULL, so the audit trigger fails the next time such a row is
-- updated. This is the same fix later applied to migrations/V274__Add_Discussion_Topic.sql on main
-- (PR #2509); it's a separate migration here instead of an edit to V277 because V277 already ran
-- against this environment under its original content and its checksum can't change retroactively.
UPDATE plan_discussion
SET
    modified_by = '00000001-0001-0001-0001-000000000001'::UUID,
    modified_dts = NOW()
WHERE modified_by IS NULL;
