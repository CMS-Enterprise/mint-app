CREATE TABLE plan_document (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL,
    file_type TEXT NOT NULL,
    bucket TEXT NOT NULL,
    file_key TEXT NOT NULL,
    virus_scanned BOOLEAN,
    virus_clean BOOLEAN,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    document_type TEXT NOT NULL, --  make enum for this
    other_type TEXT,
    deleted_at TIMESTAMP WITH TIME ZONE, --previously without timeZone...
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID NOT NULL,
    modified_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE plan_document
ADD CONSTRAINT fk_document_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
