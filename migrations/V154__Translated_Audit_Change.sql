CREATE TYPE DATABASE_OPERATION AS ENUM (
    'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE'
);

COMMENT ON TYPE DATABASE_OPERATION IS 'The possible types of operations that can cause an audit entry.
Currently they are represented in the audit.change table as the first letter of the action EG I, D, U, T.';

CREATE TABLE translated_audit_change (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    actor_id UUID NOT NULL REFERENCES user_account(id), --foreign key to user table
    actor_name ZERO_STRING NOT NULL, --foreign key to user table
    -- change_id BIGINT UNIQUE NOT NULL REFERENCES audit.change(id), --foreign key to user table
    change_id BIGINT NOT NULL REFERENCES audit.change(id), --foreign key to user table
    date TIMESTAMP NOT NULL, 
    table_id INTEGER REFERENCES audit.table_config(id), --foreign key to the audit table
    table_name ZERO_STRING NOT NULL, --potentially normalize this, wouldn't need to store, but useful?
    primary_key UUID NOT NULL,
    action DATABASE_OPERATION NOT NULL, 

    meta_data JSONB NOT NULL, -- This could be whatever
    model_name ZERO_STRING NOT NULL,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
--Ticket (EASI-4147) Turn on unique change record constrain

--Ticket (ChChCh Changes!) Decide if we want to normalize the references that duplicate data, eg, actor_name, model_name etc. All of this is technically already in the audit.change table...

-- Comment for the table
COMMENT ON TABLE translated_audit_change IS 'Table storing human-readable audit trail of changes made to model plans. There should be at most one entry per audit.change entry ';


--Ticket (ChChCh Changes!) Update these comments for the new table
-- Comments for each column
COMMENT ON COLUMN translated_audit_change.id IS 'Unique identifier for the audit trail change record.';
COMMENT ON COLUMN translated_audit_change.model_plan_id IS 'Identifier referencing the model plan associated with this audit trail change.';
COMMENT ON COLUMN translated_audit_change.actor_id IS 'Identifier of the user who performed the changes (actor).';
COMMENT ON COLUMN translated_audit_change.change_id IS 'Foreign key to the untranslated change source of this translation';
COMMENT ON COLUMN translated_audit_change.date IS 'Timestamp indicating the exact time of the change.';

COMMENT ON COLUMN translated_audit_change.meta_data IS 'JSONB data storing the details of the changes made.';
COMMENT ON COLUMN translated_audit_change.model_name IS 'String representing the model name associated with the change.';
COMMENT ON COLUMN translated_audit_change.created_by IS 'Unique identifier of the user who created the audit trail change.';
COMMENT ON COLUMN translated_audit_change.created_dts IS 'Timestamp with time zone indicating the creation time of the audit trail change.';
COMMENT ON COLUMN translated_audit_change.modified_by IS 'Unique identifier of the user who last modified the audit trail change.';
COMMENT ON COLUMN translated_audit_change.modified_dts IS 'Timestamp with time zone indicating the last modification time of the audit trail change.';

-- Ticket: (ChChCh Changes!) ADD MORE  comments for the new fields

-- Ticket: (ChChCh Changes!) Do we want to expose more fields to a parent level?
-- Should we make some paradigm choices eg changes have to be grouped by user? I think that is reasonable...

-- Ticket: (ChChCh Changes!) Ensure that we only allow one entry in a time span per user. We wouldn't want to have multiple for that range


CREATE TABLE translated_audit_field (
    id UUID PRIMARY KEY,
    translated_audit_id UUID UNIQUE NOT NULL REFERENCES translated_audit_change(id), --foreign key to translated_audit_change table


    field_name ZERO_STRING NOT NULL,
    field_name_translated ZERO_STRING NOT NULL,
    old ZERO_STRING,
    old_translated ZERO_STRING, 
    new ZERO_STRING,
    new_translated ZERO_STRING, 
    meta_data JSONB NOT NULL, -- This could be whatever

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
)
