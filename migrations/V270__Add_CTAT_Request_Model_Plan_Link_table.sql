CREATE TABLE ctat_request_model_plan_link (
    id UUID PRIMARY KEY NOT NULL,
    ctat_request_id UUID NOT NULL REFERENCES public.ctat_request(id) MATCH SIMPLE,
    model_plan_id UUID NOT NULL REFERENCES public.model_plan(id) MATCH SIMPLE,
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    CONSTRAINT ctat_request_model_plan_link_unique UNIQUE (ctat_request_id, model_plan_id)
);

COMMENT ON TABLE ctat_request_model_plan_link IS 'Associates CTAT requests to related MINT model plans.';
COMMENT ON COLUMN ctat_request_model_plan_link.id IS 'Unique identifier for the CTAT request model plan link.';
COMMENT ON COLUMN ctat_request_model_plan_link.ctat_request_id IS 'The CTAT request linked to the related MINT model.';
COMMENT ON COLUMN ctat_request_model_plan_link.model_plan_id IS 'The related MINT model plan.';
COMMENT ON COLUMN ctat_request_model_plan_link.created_by IS 'The user who created the CTAT request model plan link.';
COMMENT ON COLUMN ctat_request_model_plan_link.created_dts IS 'The timestamp when the CTAT request model plan link was created.';
COMMENT ON COLUMN ctat_request_model_plan_link.modified_by IS 'The user who last modified the CTAT request model plan link.';
COMMENT ON COLUMN ctat_request_model_plan_link.modified_dts IS 'The timestamp when the CTAT request model plan link was last modified.';
