CREATE TYPE DOCUMENT_TYPE AS ENUM ('CONCEPT_PAPER', 'POLICY_PAPER', 'ICIP_DRAFT', 'MARKET_RESEARCH', 'OTHER');
CREATE TABLE plan_document (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL,
    file_type ZERO_STRING NOT NULL,
    bucket ZERO_STRING NOT NULL,
    file_key ZERO_STRING NOT NULL,
    virus_scanned BOOLEAN NOT NULL,
    virus_clean BOOLEAN NOT NULL,
    file_name ZERO_STRING NOT NULL,
    file_size INTEGER NOT NULL,
    restricted BOOLEAN NOT NULL,
    document_type DOCUMENT_TYPE NOT NULL, --  make enum for this
    other_type ZERO_STRING,
    optional_notes ZERO_STRING,
    deleted_at TIMESTAMP WITH TIME ZONE, --previously without timeZone...
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);

ALTER TABLE plan_document
ADD CONSTRAINT fk_document_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
