CREATE TYPE TRANSLATION_AUDIT_QUEUE_STATUS_TYPE AS ENUM (
    'NEW', 'QUEUED', 'PROCESSING', 'NOT_PROCESSED', 'PROCESSED', 'RETRY', 'FAILED'
);
CREATE TABLE translated_audit_queue (
    id UUID PRIMARY KEY,

    change_id BIGINT UNIQUE NOT NULL REFERENCES audit.change(id), --foreign key to user table
    status TRANSLATION_AUDIT_QUEUE_STATUS_TYPE NOT NULL DEFAULT 'QUEUED',
    attempts INT NOT NULL DEFAULT 0,
    note ZERO_STRING,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

-- Comment for the table
COMMENT ON TABLE translated_audit_queue IS 'Table storing if an audit_change is being processed, or determined not to be processed.';


/* Mark historic entries as not processed*/

INSERT INTO translated_audit_queue (id, change_id, status, attempts, note, created_by)
SELECT
    GEN_RANDOM_UUID() AS id, -- Generate a new UUID for each record
    id AS change_id, -- User ID from user_account table
    'NOT_PROCESSED' AS status,
    0 AS attempts,
    'prior to implementation' AS note,
    '00000001-0001-0001-0001-000000000001' AS created_by --System Account
FROM
    audit.change 
ORDER BY ID ASC;
