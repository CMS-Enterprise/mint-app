SELECT
    id,
    model_name,
    abbreviation,
    archived,
    status,
    previous_suggested_phase,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM model_plan
WHERE id = :id
-- Row lock (NO KEY UPDATE so child-table FK inserts aren't blocked) serializes this read with a
-- concurrent update of the plan, e.g. a status change.
FOR NO KEY UPDATE
