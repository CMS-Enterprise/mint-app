CREATE TYPE TRANSLATION_PROCESSING_STATUS_TYPE AS ENUM (
    'QUEUED', 'NOT_PROCESSED', 'PROCESSED', 'FAILED'
);
CREATE TABLE translated_audit_queue (
    id UUID PRIMARY KEY,

    change_id BIGINT NOT NULL REFERENCES audit.change(id), --foreign key to user table
    status TRANSLATION_PROCESSING_STATUS_TYPE NOT NULL DEFAULT 'QUEUED'
    note ZERO_STRING,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

-- Comment for the table
COMMENT ON TABLE translated_audit_queue IS 'Table storing if an audit_change is being processed, or determined not to be processed.';
