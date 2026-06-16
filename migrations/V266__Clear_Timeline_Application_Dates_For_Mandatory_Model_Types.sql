-- Align stored timeline application dates with product rules:
-- mandatory model types do not use application open/close dates.

ALTER TABLE plan_timeline DISABLE TRIGGER audit_trigger;

UPDATE plan_timeline pt
SET
    applications_starts = NULL,
    applications_ends = NULL
FROM plan_basics pb
WHERE
    pb.model_plan_id = pt.model_plan_id
    AND (
        'MANDATORY_NATIONAL'::MODEL_TYPE = ANY(pb.model_type)
        OR 'MANDATORY_REGIONAL_OR_STATE'::MODEL_TYPE = ANY(pb.model_type)
    )
    AND (pt.applications_starts IS NOT NULL OR pt.applications_ends IS NOT NULL);

ALTER TABLE plan_timeline ENABLE TRIGGER audit_trigger;
