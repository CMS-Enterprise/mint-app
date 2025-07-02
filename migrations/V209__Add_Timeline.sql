ALTER TYPE table_name ADD VALUE 'plan_timeline';
COMMIT;

-- Create the new plan_timeline table
CREATE TABLE plan_timeline (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL,
    complete_icip TIMESTAMP WITH TIME ZONE NULL,
    clearance_starts TIMESTAMP WITH TIME ZONE NULL,
    clearance_ends TIMESTAMP WITH TIME ZONE NULL,
    announced TIMESTAMP WITH TIME ZONE NULL,
    applications_starts TIMESTAMP WITH TIME ZONE NULL,
    applications_ends TIMESTAMP WITH TIME ZONE NULL,
    performance_period_starts TIMESTAMP WITH TIME ZONE NULL,
    performance_period_ends TIMESTAMP WITH TIME ZONE NULL,
    wrap_up_ends TIMESTAMP WITH TIME ZONE NULL,
    high_level_note ZERO_STRING,

    created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    ready_for_review_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    ready_for_review_dts TIMESTAMP WITH TIME ZONE,
    ready_for_clearance_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    ready_for_clearance_dts TIMESTAMP WITH TIME ZONE,

    status TASK_STATUS NOT NULL DEFAULT 'READY',

    CONSTRAINT fk_timeline_model_plan FOREIGN KEY (model_plan_id)
    REFERENCES public.model_plan (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

-- Copy data from plan_basics to plan_timeline
INSERT INTO plan_timeline (
    id,
    model_plan_id,
    complete_icip,
    clearance_starts,
    clearance_ends,
    announced,
    applications_starts,
    applications_ends,
    performance_period_starts,
    performance_period_ends,
    wrap_up_ends,
    high_level_note,
    created_by,
    created_dts,
    modified_by,
    modified_dts,
    ready_for_review_by,
    ready_for_review_dts,
    ready_for_clearance_by,
    ready_for_clearance_dts,
    status
)
SELECT
    GEN_RANDOM_UUID() AS id,  -- Generate a new UUID for each row
    model_plan_id,
    complete_icip,
    clearance_starts,
    clearance_ends,
    announced,
    applications_starts,
    applications_ends,
    performance_period_starts,
    performance_period_ends,
    wrap_up_ends,
    high_level_note,
    created_by,
    created_dts,
    modified_by,
    modified_dts,
    ready_for_review_by,
    ready_for_review_dts,
    ready_for_clearance_by,
    ready_for_clearance_dts,
    status
FROM plan_basics;

ALTER TABLE plan_basics DISABLE TRIGGER audit_trigger;

ALTER TABLE plan_basics
DROP COLUMN complete_icip,
DROP COLUMN clearance_starts,
DROP COLUMN clearance_ends,
DROP COLUMN announced,
DROP COLUMN applications_starts,
DROP COLUMN applications_ends,
DROP COLUMN performance_period_starts,
DROP COLUMN performance_period_ends,
DROP COLUMN wrap_up_ends,
DROP COLUMN high_level_note;

ALTER TABLE plan_basics ENABLE TRIGGER audit_trigger;

-- Add audit configuration for the new plan_timeline table
SELECT audit.AUDIT_TABLE(
    'public',
    'plan_timeline',
    'id',
    'model_plan_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*}'::TEXT[]
);
