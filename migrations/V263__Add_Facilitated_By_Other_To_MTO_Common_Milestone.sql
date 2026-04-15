ALTER TABLE mto_common_milestone
ADD COLUMN facilitated_by_other ZERO_STRING;

COMMENT ON COLUMN mto_common_milestone.facilitated_by_other IS
'Optional free-text detail used when the facilitated_by_role array includes OTHER.';

ALTER TABLE mto_common_milestone
ADD CONSTRAINT mto_common_milestone_check_facilitated_by_other_only_if_other
CHECK (
    facilitated_by_other IS NULL
    OR COALESCE(facilitated_by_role @> ARRAY['OTHER']::MTO_FACILITATOR[], FALSE) -- does the array contain OTHER?
);

COMMENT ON CONSTRAINT mto_common_milestone_check_facilitated_by_other_only_if_other
ON mto_common_milestone IS
'Ensures that facilitated_by_other can only be provided if facilitated_by_role includes the OTHER option.';

ALTER TABLE mto_common_milestone
ADD CONSTRAINT mto_common_milestone_check_other_requires_facilitated_by_other
CHECK (
    COALESCE(facilitated_by_role @> ARRAY['OTHER']::MTO_FACILITATOR[], FALSE) = FALSE -- if the array contains `other`, text is required in `facilitated_by_other`
    OR facilitated_by_other IS NOT NULL
);

COMMENT ON CONSTRAINT mto_common_milestone_check_other_requires_facilitated_by_other
ON mto_common_milestone IS
'Ensures that if facilitated_by_role includes OTHER, facilitated_by_other must also be provided.';
