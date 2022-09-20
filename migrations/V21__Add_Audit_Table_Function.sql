CREATE FUNCTION audit.audit_table(schema_name TEXT, table_name TEXT, primary_key TEXT, secondary_key TEXT, ignored_cols TEXT[], insert_cols TEXT[]) RETURNS VOID AS $body$
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
        schema, name, created_by_field, modified_by_field, pkey_field, fkey_field, ignored_fields, created_by, created_dts, insert_fields)
        VALUES ( schema_name, table_name, 'created_by', 'modified_by', primary_key, secondary_key, ignored_cols, 'MINT', CURRENT_TIMESTAMP,insert_cols);
    ELSE
        UPDATE audit.table_config
        SET 
            pkey_field = primary_key,
            fkey_field = secondary_key,
            ignored_fields = ignored_cols,
            insert_fields = insert_cols,
            modified_by = 'MINT',
            modified_dts = CURRENT_TIMESTAMP
        WHERE id = existing_table_id;
    END IF;




END
$body$ LANGUAGE plpgsql;


SELECT audit.audit_table('public', 'plan_basics', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);



SELECT audit.audit_table('public', 'model_plan', 'id', NULL, '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{model_name}'::TEXT[]);
