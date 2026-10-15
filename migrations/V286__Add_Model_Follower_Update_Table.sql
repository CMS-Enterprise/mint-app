ALTER TYPE TABLE_NAME ADD VALUE 'model_follower_update';
COMMIT;

CREATE TABLE model_follower_update (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL REFERENCES public.model_plan (id) MATCH SIMPLE ON DELETE CASCADE,
    content ZERO_STRING NOT NULL,
    created_by UUID NOT NULL REFERENCES public.user_account (id) MATCH SIMPLE,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE model_follower_update IS 'Messages sent by a model team to everyone following the model plan.';

SELECT audit.AUDIT_TABLE(
    'public',
    'model_follower_update',
    'id',
    'model_plan_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*}'::TEXT[]
);
