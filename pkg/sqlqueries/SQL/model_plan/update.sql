UPDATE model_plan
SET
    model_name = :model_name,
    abbreviation = :abbreviation,
    status = :status,
    previous_suggested_phase = :previous_suggested_phase,
    archived = :archived,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP,
    mto_ready_for_review_by = :mto_ready_for_review_by,
    mto_ready_for_review_dts = :mto_ready_for_review_dts
WHERE model_plan.id = :id
RETURNING
id,
model_name,
abbreviation,
archived,
status,
previous_suggested_phase,
created_by,
created_dts,
modified_by,
modified_dts,
mto_ready_for_review_by,
mto_ready_for_review_dts;
