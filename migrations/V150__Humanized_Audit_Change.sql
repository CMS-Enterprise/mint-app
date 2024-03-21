CREATE TABLE humanized_audit_changes (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    actor_id UUID NOT NULL REFERENCES user_account(id), --foreign key to user table
    change_id BIGINT NOT NULL REFERENCES audit.change(id), --foreign key to user table
    date TIMESTAMP NOT NULL, 
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    changes JSONB NOT NULL,
    model_name ZERO_STRING NOT NULL,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
--Ticket: (ChChCh Changes!) We might want to put time info in a single column...
--Ticket (ChChCh Changes!)  Consider removing time start and time end and just use date

-- Comment for the table
COMMENT ON TABLE humanized_audit_changes IS 'Table storing human-readable audit trail of changes made to model plans.';

-- Comments for each column
COMMENT ON COLUMN humanized_audit_changes.id IS 'Unique identifier for the audit trail change record.';
COMMENT ON COLUMN humanized_audit_changes.model_plan_id IS 'Identifier referencing the model plan associated with this audit trail change.';
COMMENT ON COLUMN humanized_audit_changes.actor_id IS 'Identifier of the user who performed the changes (actor).';
COMMENT ON COLUMN humanized_audit_changes.change_id IS 'Foreign key to the untranslated change source of this translation';
COMMENT ON COLUMN humanized_audit_changes.date IS 'Timestamp indicating the exact time of the change.';
COMMENT ON COLUMN humanized_audit_changes.time_start IS 'Timestamp indicating the start time of the change.';
COMMENT ON COLUMN humanized_audit_changes.time_end IS 'Timestamp indicating the end time of the change.';
COMMENT ON COLUMN humanized_audit_changes.changes IS 'JSONB data storing the details of the changes made.';
COMMENT ON COLUMN humanized_audit_changes.model_name IS 'String representing the model name associated with the change.';
COMMENT ON COLUMN humanized_audit_changes.created_by IS 'Unique identifier of the user who created the audit trail change.';
COMMENT ON COLUMN humanized_audit_changes.created_dts IS 'Timestamp with time zone indicating the creation time of the audit trail change.';
COMMENT ON COLUMN humanized_audit_changes.modified_by IS 'Unique identifier of the user who last modified the audit trail change.';
COMMENT ON COLUMN humanized_audit_changes.modified_dts IS 'Timestamp with time zone indicating the last modification time of the audit trail change.';

-- Ticket: (ChChCh Changes!) Do we want to expose more fields to a parent level?
-- Should we make some paradigm choices eg changes have to be grouped by user? I think that is reasonable...

-- Ticket: (ChChCh Changes!) Ensure that we only allow one entry in a time span per user. We wouldn't want to have multiple for that range
