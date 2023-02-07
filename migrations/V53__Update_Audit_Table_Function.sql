CREATE OR REPLACE FUNCTION audit.audit_table(schema_name TEXT, table_name TEXT, primary_key TEXT, secondary_key TEXT, ignored_cols TEXT[], insert_cols TEXT[]) RETURNS VOID AS $body$
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
$body$ LANGUAGE plpgsql;
