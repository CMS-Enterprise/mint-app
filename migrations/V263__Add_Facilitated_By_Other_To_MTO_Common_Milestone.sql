ALTER TABLE mto_common_milestone
ADD COLUMN facilitated_by_other ZERO_STRING;

COMMENT ON COLUMN mto_common_milestone.facilitated_by_other IS
'Optional free-text detail used when the facilitated_by_role array includes OTHER.';

ALTER TABLE mto_common_milestone
ADD CONSTRAINT mto_common_milestone_check_facilitated_by_other_only_if_other
CHECK (
    facilitated_by_other IS NULL
    OR facilitated_by_role @> ARRAY['OTHER']::MTO_FACILITATOR[]
);

COMMENT ON CONSTRAINT mto_common_milestone_check_facilitated_by_other_only_if_other
ON mto_common_milestone IS
'Ensures that facilitated_by_other can only be provided if facilitated_by_role includes the OTHER option.';
