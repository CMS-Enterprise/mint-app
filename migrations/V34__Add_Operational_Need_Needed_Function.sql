CREATE FUNCTION public.ADD_OPERATIONAL_NEED_NEEDED_TRIGGER(schema_name TEXT, table_name TEXT) RETURNS VOID AS $body$DECLARE
    _q_txt TEXT;
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS operational_need_trigger ON ' || schema_name || '.' || table_name;
    _q_txt = 'CREATE TRIGGER operational_need_trigger AFTER UPDATE ON ' || 
                 schema_name || '.' || table_name || 
                ' FOR EACH ROW EXECUTE PROCEDURE public.SET_OPERATIONAL_NEED_NEEDED();';

    RAISE NOTICE '%',_q_txt;
    EXECUTE _q_txt;


END
$body$ LANGUAGE plpgsql;
