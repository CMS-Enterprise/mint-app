ALTER TYPE TABLE_NAME ADD VALUE 'plan_task_document_link';
COMMIT;

CREATE TABLE plan_task_document_link (
    id UUID PRIMARY KEY NOT NULL,
    plan_task_id UUID NOT NULL REFERENCES public.plan_task(id) ON DELETE CASCADE,
    plan_document_id UUID NOT NULL REFERENCES public.plan_document(id) ON DELETE CASCADE,

    --META DATA
    created_by UUID NOT NULL REFERENCES public.user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE,

    CONSTRAINT plan_task_document_link_plan_document_id_unique UNIQUE (plan_document_id)
);

COMMENT ON TABLE plan_task_document_link IS 'Links plan tasks to plan documents.';
COMMENT ON CONSTRAINT plan_task_document_link_plan_document_id_unique ON plan_task_document_link IS 'Enforces that a single plan document can be linked to at most one plan task.';

SELECT audit.AUDIT_TABLE(
    'public',
    'plan_task_document_link',
    'id',
    'plan_task_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,plan_task_id,plan_document_id}'::TEXT[],
    'plan_document_id'
);
