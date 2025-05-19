CREATE FUNCTION public.ADD_MTO_SUGGESTED_MILESTONE_SUGGESTION_TRIGGER(schema_name TEXT, table_name TEXT) RETURNS VOID AS $body$DECLARE
    _q_txt TEXT;
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS mto_suggested_milestone_trigger ON ' || schema_name || '.' || table_name;
    _q_txt = 'CREATE TRIGGER mto_suggested_milestone_trigger AFTER UPDATE ON ' || 
                 schema_name || '.' || table_name || 
                ' FOR EACH ROW EXECUTE PROCEDURE public.SET_SUGGESTED_MTO_MILESTONE();';

    RAISE NOTICE '%',_q_txt;
    EXECUTE _q_txt;


END
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION ADD_MTO_SUGGESTED_MILESTONE_SUGGESTION_TRIGGER IS 'This is a convenience function that stores the logic to add the SET_SUGGESTED_MTO_MILESTONE trigger on a table.
The created trigger will be called mto_suggested_milestone_trigger';
