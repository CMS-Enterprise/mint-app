-- Add secondary_foreign_key column to audit.change table to support tracking linking tables
ALTER TABLE audit.change
ADD COLUMN secondary_foreign_key UUID;

-- Add fkey_field_secondary column to audit.table_config to store the secondary foreign key field name
ALTER TABLE audit.table_config
ADD COLUMN fkey_field_secondary TEXT;

-- Update the audit.if_modified() trigger function to populate secondary_foreign_key
CREATE OR REPLACE FUNCTION audit.if_modified() RETURNS TRIGGER AS $audit_table$
DECLARE
    audit_row audit.change;
    include_values boolean;
    log_diffs boolean;
    h_old hstore;
    h_new hstore;
    table_id int;
    excluded_cols text[] = ARRAY[]::text[];
    insert_cols text[] = ARRAY[]::text[];
    pkey_f TEXT;
    fkey_f TEXT;
    fkey_f_secondary TEXT;
    created_by_f TEXT;
    modified_by_f TEXT;
    table_uses_user_id boolean;
    h_changed HSTORE;
    diff_keys text[] = ARRAY[]::text[];
    changeJSON JSONB;
    modified_by_user_id UUID;
    created_by_user_id UUID;
    deleted_user_uuid UUID = '00000000-0000-0000-0000-000000000000'; -- default to unknown user

BEGIN
    IF TG_WHEN <> 'AFTER' THEN
        RAISE EXCEPTION 'audit.audit_trigger() may only run as an AFTER trigger';
    END IF;

    SELECT
    id,
    ignored_fields,
    insert_fields,
    created_by_field,
    modified_by_field,
    pkey_field,
    fkey_field,
    fkey_field_secondary,
    uses_user_id
    INTO
    table_id,
    excluded_cols,
    insert_cols,
    created_by_f,
    modified_by_f,
    pkey_f,
    fkey_f,
    fkey_f_secondary,
    table_uses_user_id
    FROM audit.table_config
    WHERE schema =TG_TABLE_SCHEMA::text AND name = TG_TABLE_NAME::TABLE_NAME;

    h_new= hstore(NEW.*);
    h_old= hstore(OLD.*);


    IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
        IF insert_cols && '{"*"}' THEN  -- Check if insert cols includes asterisk

            -- Check if insert cols include foreign key
            IF NOT fkey_f = ANY(insert_cols) THEN
            excluded_cols = array_append(excluded_cols, fkey_f);
            END IF;

            -- Check if insert cols include primary key, if not, exclude
            IF NOT pkey_f = ANY(insert_cols) THEN
            excluded_cols = array_append(excluded_cols, pkey_f);
            END IF;

            -- Check if insert cols include secondary foreign key, if not, exclude
            IF fkey_f_secondary IS NOT NULL AND NOT fkey_f_secondary = ANY(insert_cols) THEN
            excluded_cols = array_append(excluded_cols, fkey_f_secondary);
            END IF;

            h_changed = (h_new - h_old) - excluded_cols;  -- Removed unchanged (matching) values and columns configured as the primary or foreign key
        ELSE
        diff_keys = (akeys(h_new - insert_cols)); --These are the keys that have changed that are not configured to be shown on insert. They are used to subtract from all the keys on insert or delete to show only the configured columns
        h_changed = (h_new -h_old) -diff_keys; --Removed unchanged (matching) values, and only  show specific columns for insert /delete
        END IF;
    ELSE
        h_changed = (h_new - h_old) - excluded_cols; --Removed unchanged (matching) values and columns explicitly set to be excluded
    END If;

    IF TG_OP = 'UPDATE' AND h_changed = hstore('') THEN
       RETURN NULL;
    END IF;  -- All changed fields are ignored. Skip this update.
        WITH NEWval AS
        (
            SELECT (EACH(h_changed)).*
        )
        ,RESULTSet AS
        (
            SELECT
            NEWval.key AS field,
            NEWval.value AS new,
            h_old -> NEWval.key AS old
            FROM NEWval
        )
        SELECT jsonb_object_agg(field,(to_jsonb(r) - 'field'))
        INTO changeJSON
            FROM RESULTSet r;
    -- Set the EUAID

    modified_by_user_id = NEW.modified_by;
    created_by_user_id = NEW.created_by;


    audit_row = ROW (
    nextval('audit.change_id_seq'), --id
        table_id, --table_id
        h_new -> pkey_f, --primary_key
        h_new -> fkey_f, --foreign_key
        substring(TG_OP,1,1), --action
        changeJSON, --fields
        CURRENT_TIMESTAMP, --modified_dts
        modified_by_user_id, --modified_by
        h_new -> fkey_f_secondary --secondary_foreign_key
    );
    IF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
        BEGIN
            deleted_user_uuid = COALESCE(current_setting('app.current_user',TRUE),'00000000-0000-0000-0000-000000000000'); --Try to get user from variable, if not will default to unknown
            EXCEPTION
                WHEN OTHERS THEN RAISE NOTICE 'there was an issue getting the user id for this delete operation';
        END;
        audit_row.modified_by = deleted_user_uuid;
        audit_row.primary_key = h_old -> pkey_f; --New is null
        audit_row.foreign_key = h_old -> fkey_f;
        audit_row.secondary_foreign_key = h_old -> fkey_f_secondary;
    ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
        audit_row.modified_dts = NEW.created_dts;
        audit_row.modified_by = created_by_user_id;
    END IF;

    INSERT INTO audit.change VALUES(audit_row.*);

    INSERT INTO public.translated_audit_queue(
        id, change_id, status, attempts,created_by)
    VALUES(
        GEN_RANDOM_UUID(),
        audit_row.id,
        'NEW',
        0,
        '00000001-0001-0001-0001-000000000001' --System Account
    );

    RETURN NULL;



END;
$audit_table$ LANGUAGE plpgsql
SECURITY DEFINER --Run trigger as the creator of the trigger
SET search_path = pg_catalog, public;

-- Update the audit.audit_table() function to accept a secondary_fkey parameter
DROP FUNCTION IF EXISTS audit.audit_table(TEXT, TABLE_NAME, TEXT, TEXT, TEXT[], TEXT[]);

CREATE OR REPLACE FUNCTION audit.audit_table(IN schema_name TEXT,IN table_name TABLE_NAME,IN primary_key TEXT,IN secondary_key TEXT,IN ignored_cols TEXT[],IN insert_cols TEXT[], IN secondary_fkey TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE 'plpgsql'

AS $BODY$
DECLARE
  _q_txt TEXT;
  include_values BOOLEAN;
  existing_table_id INT;
BEGIN
  EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger ON ' || schema_name || '.' || table_name;
  _q_txt = 'CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON ' ||
           schema_name || '.' || table_name ||
           ' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified();';
  RAISE NOTICE '%',_q_txt;
  EXECUTE _q_txt;
  SELECT id INTO existing_table_id FROM audit.table_config WHERE schema = schema_name AND name = table_name;
  IF existing_table_id IS NULL THEN
    INSERT INTO audit.table_config(
      schema, name, created_by_field, modified_by_field, pkey_field, fkey_field, fkey_field_secondary, ignored_fields, created_by, created_dts, insert_fields, uses_user_id)
    VALUES ( schema_name, table_name, 'created_by', 'modified_by', primary_key, secondary_key, secondary_fkey, ignored_cols, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP, insert_cols, TRUE);
  ELSE
    UPDATE audit.table_config
    SET
      pkey_field = primary_key,
      fkey_field = secondary_key,
      fkey_field_secondary = secondary_fkey,
      ignored_fields = ignored_cols,
      insert_fields = insert_cols,
      modified_by = '00000001-0001-0001-0001-000000000001',
      modified_dts = CURRENT_TIMESTAMP,
      uses_user_id = TRUE
    WHERE id = existing_table_id;
  END IF;
END
$BODY$;

COMMENT ON FUNCTION audit.audit_table IS 'This function enables auditing on a specified table, and either inserts or updates the table auditing configuration.
It requires that the table name be added to the TABLE_NAME enum before inserting, or else the function will error.
Params
schema = the schema of the table
table_name = the name of the table
primary_key = the column name of the column that holds the primary key (most often id)
secondary_key = the column name of the column that holds the (a) foreign key.
ignored_cols = a text array of column names that should not be inserted as changed fields.
insert_cols = a text array of column names that should be included when the data is first inserted. This is useful for excluding extra data.
  This can include the value * if the desire is to include all columns on insert. You can also include the name of the primary_key or secondary_key and these will be explicitly added even though theyd normally be excluded.
secondary_fkey = (optional) the column name of the column that holds a secondary foreign key. This is useful for linking tables where you want to track both foreign keys.

  Example
  SELECT audit.AUDIT_TABLE(''public'', ''testing_table'', ''id'', NULL, ''{created_by,created_dts,modified_by,modified_dts}''::TEXT[], ''{*,id}''::TEXT[])
  This will enable auditing on this testing_table, and will explicitly insert all columns, as well as including the primary key column id in the records. Note the secondary key column is null

    NOTE: if the testing_table enum value did not exist on the TABLE_NAME type, it would need to be added for this to work
    ALTER TYPE TABLE_NAME ADD VALUE ''testing_table'';

  Example with secondary foreign key (for linking tables):
  SELECT audit.AUDIT_TABLE(''public'', ''mto_milestone_solution_link'', ''id'', ''milestone_id'', ''{created_by,created_dts,modified_by,modified_dts}''::TEXT[], ''{*,milestone_id}''::TEXT[], ''solution_id'')
  This will track both milestone_id as the primary foreign key and solution_id as the secondary foreign key.
';

-- Update mto_milestone_solution_link to track solution_id as secondary foreign key
UPDATE audit.table_config
SET
    fkey_field_secondary = 'solution_id',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = CURRENT_TIMESTAMP,
    insert_fields = '{*,milestone_id, solution_id}'::TEXT[]
WHERE schema = 'public' AND name = 'mto_milestone_solution_link';

-- Update plan_document_solution_link to track document_id as secondary foreign key
-- Also update insert_cols to include both document_id and solution_id
UPDATE audit.table_config
SET
    fkey_field_secondary = 'document_id',
    insert_fields = '{*,document_id, solution_id}'::TEXT[],
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = CURRENT_TIMESTAMP
WHERE schema = 'public' AND name = 'plan_document_solution_link';

-- Update existing_model_link to track current_model_plan_id as secondary foreign key
UPDATE audit.table_config
SET
    fkey_field_secondary = 'current_model_plan_id',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = CURRENT_TIMESTAMP,
    insert_fields = '{*,current_model_plan_id}'::TEXT[]
WHERE schema = 'public' AND name = 'existing_model_link';
