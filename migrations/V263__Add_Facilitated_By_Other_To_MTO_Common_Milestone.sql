ALTER TABLE mto_common_milestone
ADD COLUMN facilitated_by_other TEXT;

COMMENT ON COLUMN mto_common_milestone.facilitated_by_other IS
'Optional free-text detail used when the facilitated_by_role array includes OTHER.';
