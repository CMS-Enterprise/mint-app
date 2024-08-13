CREATE TYPE MODEL_PHASE AS ENUM (
    'ICIP_COMPLETE',
    'IN_CLEARANCE',
    'CLEARED',
    'ANNOUNCED',
    'ACTIVE',
    'ENDED'
);

ALTER TABLE model_plan
ADD COLUMN previous_suggested_phase MODEL_PHASE DEFAULT NULL;

COMMENT ON COLUMN model_plan.previous_suggested_phase IS 'The previous suggested phase of the model plan. This field is cleared when the model plan timeline is updated.';
