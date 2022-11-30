CREATE TABLE analyzed_audit (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL, --foreign key to model plan
    date TIMESTAMP NOT NULL,
    changes JSONB NOT NULL,

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);
ALTER TABLE analyzed_audit
ADD CONSTRAINT fk_analyzed_audit FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;
