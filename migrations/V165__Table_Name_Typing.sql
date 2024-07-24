CREATE TYPE TABLE_NAME AS ENUM (
    'activity',  'analyzed_audit',  'discussion_reply',  'existing_model',  'existing_model_link',  'model_plan',  'nda_agreement',  'operational_need',  'operational_solution',  'operational_solution_subtask',  'plan_basics',  'plan_beneficiaries',  'plan_collaborator',  'plan_cr',  'plan_discussion',  'plan_document',  'plan_document_solution_link',  'plan_favorite',  'plan_general_characteristics',  'plan_ops_eval_and_learning',  'plan_participants_and_providers',  'plan_payments',  'plan_tdl',  'possible_need_solution_link',  'possible_operational_need',  'possible_operational_solution',  'possible_operational_solution_contact',  'tag',  'translated_audit',  'translated_audit_field',  'translated_audit_queue',  'user_account',  'user_notification',  'user_notification_preferences', 'user_view_customization'
);

COMMENT ON TYPE TABLE_NAME IS 'These are the possible values of the table names that are currently in the public schema';

-- Update the table_config table to use this enum type.
ALTER TABLE audit.table_config
ALTER COLUMN name TYPE TABLE_NAME USING name::TABLE_NAME;

-- Drop table as we are changing the parameters
/*
The only change here is that table_name changed from TEXT to TABLE_NAME enum type
*/
DROP FUNCTION audit.audit_table;

CREATE OR REPLACE FUNCTION audit.audit_table(IN schema_name TEXT,IN table_name TABLE_NAME,IN primary_key TEXT,IN secondary_key TEXT,IN ignored_cols TEXT[],IN insert_cols TEXT[])
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
      schema, name, created_by_field, modified_by_field, pkey_field, fkey_field, ignored_fields, created_by, created_dts, insert_fields, uses_user_id)
    VALUES ( schema_name, table_name, 'created_by', 'modified_by', primary_key, secondary_key, ignored_cols, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP, insert_cols, TRUE);
  ELSE
    UPDATE audit.table_config
    SET
      pkey_field = primary_key,
      fkey_field = secondary_key,
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

  Example
  SELECT audit.AUDIT_TABLE(''public'', ''testing_table'', ''id'', NULL, ''{created_by,created_dts,modified_by,modified_dts}''::TEXT[], ''{*,id}''::TEXT[])
  This will enable auditing on this testing_table, and will explicitly insert all columns, as well as including the primary key column id in the records. Note the secondary key column is null

    NOTE: if the testing_table enum value did not exist on the TABLE_NAME type, it would need to be added for this to work
    ALTER TYPE TABLE_NAME ADD VALUE ''testing_table'';

'
