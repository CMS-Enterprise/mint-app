CREATE TABLE ctat_request_document (
    id UUID PRIMARY KEY NOT NULL,
    ctat_request_id UUID NOT NULL REFERENCES public.ctat_request(id) MATCH SIMPLE,
    url ZERO_STRING,
    file_type ZERO_STRING NOT NULL,
    bucket ZERO_STRING NOT NULL,
    file_key ZERO_STRING NOT NULL,
    virus_scanned BOOLEAN NOT NULL DEFAULT FALSE,
    virus_clean BOOLEAN NOT NULL DEFAULT FALSE,
    restricted BOOLEAN NOT NULL DEFAULT FALSE,
    file_name ZERO_STRING NOT NULL,
    file_size INTEGER NOT NULL,
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE ctat_request_document IS 'A supporting document attached to a CTAT request.';
COMMENT ON COLUMN ctat_request_document.id IS 'Unique identifier for the CTAT request document.';
COMMENT ON COLUMN ctat_request_document.ctat_request_id IS 'The CTAT request the supporting document belongs to.';
COMMENT ON COLUMN ctat_request_document.url IS 'Optional URL for retrieving the supporting document.';
COMMENT ON COLUMN ctat_request_document.file_type IS 'The MIME type of the stored document.';
COMMENT ON COLUMN ctat_request_document.bucket IS 'The storage bucket containing the document.';
COMMENT ON COLUMN ctat_request_document.file_key IS 'The storage key for the document.';
COMMENT ON COLUMN ctat_request_document.virus_scanned IS 'Whether the document has been scanned for viruses.';
COMMENT ON COLUMN ctat_request_document.virus_clean IS 'Whether the most recent virus scan marked the document as clean.';
COMMENT ON COLUMN ctat_request_document.restricted IS 'Whether access to the document is restricted.';
COMMENT ON COLUMN ctat_request_document.file_name IS 'The original file name.';
COMMENT ON COLUMN ctat_request_document.file_size IS 'The size of the file in bytes.';
COMMENT ON COLUMN ctat_request_document.created_by IS 'The user who created the CTAT request document record.';
COMMENT ON COLUMN ctat_request_document.created_dts IS 'The timestamp when the CTAT request document record was created.';
COMMENT ON COLUMN ctat_request_document.modified_by IS 'The user who last modified the CTAT request document record.';
COMMENT ON COLUMN ctat_request_document.modified_dts IS 'The timestamp when the CTAT request document record was last modified.';
