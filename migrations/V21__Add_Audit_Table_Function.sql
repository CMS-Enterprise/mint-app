CREATE FUNCTION audit.audit_table(schema TEXT, table_name TEXT, primary_key TEXT, secondary_key TEXT, ignored_cols TEXT[]) RETURNS VOID AS $body$
DECLARE
    _q_txt text;
    include_values boolean;
    log_diffs boolean;
    h_old hstore;
    h_new hstore;
    excluded_cols text[] = ARRAY[]::text[];
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger ON ' || schema || '.' || table_name;
    _q_txt = 'CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON ' || 
                 schema || '.' || table_name || 
                ' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified();';

    RAISE NOTICE '%',_q_txt;
    EXECUTE _q_txt;
    ---UPDATE TO INSERT OR UPDATE
    INSERT INTO audit.table_config(
	 schema, name, created_by_field, modified_by_field, pkey_field, fkey_field, ignored_fields, created_by, created_dts)
    VALUES ( schema, table_name, 'created_by', 'modified_by', primary_key, secondary_key, ignored_cols, 'MINT', CURRENT_TIMESTAMP);




END
$body$ LANGUAGE plpgsql;


SELECT audit.audit_table('public', 'plan_basics', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[]);



SELECT audit.audit_table('public', 'model_plan', 'id', NULL, '{created_by,created_dts,modified_by,modified_dts}'::TEXT[]);
