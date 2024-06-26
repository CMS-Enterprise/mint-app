CREATE TYPE DATABASE_OPERATION AS ENUM (
    'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE'
);

COMMENT ON TYPE DATABASE_OPERATION IS 'The possible types of operations that can cause an audit entry.
Currently they are represented in the audit.change table as the first letter of the action EG I, D, U, T.';

CREATE TYPE TRANSLATED_AUDIT_META_DATA_TYPE AS ENUM (
    'BASE', 'GENERIC', 'DISCUSSION_REPLY', 'OPERATIONAL_NEED', 'OPERATIONAL_SOLUTION', 'OPERATIONAL_SOLUTION_SUBTASK', 'DOCUMENT_SOLUTION_LINK'
);
COMMENT ON TYPE TRANSLATED_AUDIT_META_DATA_TYPE IS 'The possible meta data types that can be stored on a translated audit entry';

CREATE TABLE translated_audit (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    actor_id UUID NOT NULL REFERENCES user_account(id), --foreign key to user table
    change_id BIGINT UNIQUE NOT NULL REFERENCES audit.change(id), --foreign key to user table
    date TIMESTAMP NOT NULL, 
    table_id INTEGER REFERENCES audit.table_config(id), --foreign key to the audit table
    primary_key UUID NOT NULL,
    action DATABASE_OPERATION NOT NULL, 
    restricted BOOLEAN NOT NULL,

    meta_data_type TRANSLATED_AUDIT_META_DATA_TYPE,
    meta_data JSONB,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);


ALTER TABLE translated_audit
ADD CONSTRAINT meta_data_type_requires_meta_data CHECK (
    (meta_data_type IS NOT NULL AND meta_data IS NOT NULL)
    OR
    (meta_data_type IS NULL AND meta_data IS NULL)
);

COMMENT ON CONSTRAINT meta_data_type_requires_meta_data ON translated_audit IS 'This requires that either the meta data and the meta data type or null, or they are both not null';


-- Comment for the table
COMMENT ON TABLE translated_audit IS 'Table storing human-readable audit trail of changes made to model plans. There should be at most one entry per audit.change entry ';


COMMENT ON COLUMN translated_audit.restricted IS 'This column specifies if the data should be restricted to users who have elevated permissions';
COMMENT ON COLUMN translated_audit.id IS 'Unique identifier for the audit trail change record.';
COMMENT ON COLUMN translated_audit.model_plan_id IS 'Identifier referencing the model plan associated with this audit trail change.';
COMMENT ON COLUMN translated_audit.actor_id IS 'Identifier of the user who performed the changes (actor).';
COMMENT ON COLUMN translated_audit.change_id IS 'Foreign key to the untranslated change source of this translation';
COMMENT ON COLUMN translated_audit.date IS 'Timestamp indicating the exact time of the change.';


COMMENT ON COLUMN translated_audit.table_id IS 'Foreign key to the audit.table_config table'
COMMENT ON COLUMN translated_audit.primary_key IS 'The primary key of the record of the original audit record.'
COMMENT ON COLUMN translated_audit.action IS 'Specifies what type of action caused the audit '
COMMENT ON COLUMN translated_audit.restricted IS 'This column specifies if the data should be restricted to users who have elevated permissions';
COMMENT ON COLUMN translated_audit.meta_data_type IS 'Enum type which specifies what type of meta data to expect in the meta data column. This is used for deserialization'
COMMENT ON COLUMN translated_audit.meta_data IS 'JSONB data storing the details of the changes made.';
COMMENT ON COLUMN translated_audit.created_by IS 'Unique identifier of the user who created the audit trail change.';
COMMENT ON COLUMN translated_audit.created_dts IS 'Timestamp with time zone indicating the creation time of the audit trail change.';
COMMENT ON COLUMN translated_audit.modified_by IS 'Unique identifier of the user who last modified the audit trail change.';
COMMENT ON COLUMN translated_audit.modified_dts IS 'Timestamp with time zone indicating the last modification time of the audit trail change.';



-- Changes: (Serialization) Ensure that we only allow one entry in a time span per user. We wouldn't want to have multiple for that range

CREATE TYPE AUDIT_FIELD_CHANGE_TYPE AS ENUM (
    'ANSWERED', 'UPDATED', 'REMOVED', 'UNCHANGED'
);

COMMENT ON TYPE AUDIT_FIELD_CHANGE_TYPE IS 'An interpretation of what action happened on a database operation';



CREATE TYPE  TRANSLATION_DATA_TYPE AS ENUM (
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'DATE',
    'ENUM',
    'OBJECT',
    'UUID'
);
COMMENT ON TYPE TRANSLATION_DATA_TYPE IS 'Represents the data type of the translation field';


CREATE TYPE TRANSLATION_FORM_TYPE AS ENUM (
    'TEXT',
    'TEXTAREA',
    'NUMBER',
    'BOOLEAN',
    'RADIO',
    'CHECKBOX',
    'SELECT',
    'MULTISELECT',
    'DATEPICKER',
    'RANGEINPUT'
);

CREATE TYPE TRANSLATION_QUESTION_TYPE AS ENUM (
    'OTHER',
    'NOTE'
);

COMMENT ON TYPE TRANSLATION_DATA_TYPE IS 'Represents the FORM type of the translation field';

-- Changes: (Structure) Double check the data and form type columns. Can they ever be null? Eg what happens when we don't find a translation? Should we make a new type, or make it nullable?
-- Currently allowing them to be null if a translation is not found

-- Changes: (Structure) potentially make question_type not be nullable, so we always have to provide it?
CREATE TABLE translated_audit_field (
    id UUID PRIMARY KEY,
    translated_audit_id UUID NOT NULL REFERENCES translated_audit(id), --foreign key to translated_audit table

    change_type AUDIT_FIELD_CHANGE_TYPE NOT NULL,
    data_type TRANSLATION_DATA_TYPE,
    form_type TRANSLATION_FORM_TYPE,

    field_name ZERO_STRING NOT NULL,
    field_name_translated ZERO_STRING NOT NULL,
    field_order REAL NOT NULL,
    
    reference_label ZERO_STRING, --nullable, useful for "note" and "other" columns
    question_type TRANSLATION_QUESTION_TYPE, -- note or other
    not_applicable_questions ZERO_STRING[], -- note or other



    old ZERO_STRING,
    old_translated ZERO_STRING, 
    new ZERO_STRING,
    new_translated ZERO_STRING, 
    meta_data JSONB NOT NULL, -- This could be whatever

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON COLUMN translated_audit_field.field_order IS 'This is a decimal column that shows the page number as well as the question order in the page number by the decimal number. It is used for consistent ordering or a result set';
