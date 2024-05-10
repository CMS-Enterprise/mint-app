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
    uses_user_id
    INTO
    table_id,
    excluded_cols,
    insert_cols,
    created_by_f,
    modified_by_f,
    pkey_f,
    fkey_f,
    table_uses_user_id
    FROM audit.table_config
    WHERE schema =TG_TABLE_SCHEMA::text AND name = TG_TABLE_NAME::text;

    h_new= hstore(NEW.*);
    h_old= hstore(OLD.*);

    diff_keys = (akeys(h_new - insert_cols)); --these are the keys to subtract from all the keys on insert or deleted
    IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
        IF insert_cols = '{*}' THEN 
            h_changed = (h_new - h_old) - array_append(excluded_cols, pkey_f); --remove matching values and primary key
        ELSE
        h_changed = (h_new -h_old) -diff_keys; --remove matching values, and only  show specific columns for insert /delete
        END IF;
    ELSE
        h_changed = (h_new - h_old) - excluded_cols; --remove matching values and excluded columns
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
        modified_by_user_id --modified_by
    );
    IF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
        BEGIN
            deleted_user_uuid = COALESCE(current_setting('app.current_user',TRUE),'00000000-0000-0000-0000-000000000000'); --Try to get user from variable, if not will default to unknown
            EXCEPTION
                WHEN OTHERS THEN RAISE NOTICE 'yep, there was an issue';
        END;
        audit_row.modified_by = deleted_user_uuid;
        audit_row.primary_key = h_old -> pkey_f; --New is null
        audit_row.foreign_key = h_old -> fkey_f;
    ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
        audit_row.modified_by = created_by_user_id;
        audit_row.modified_dts = NEW.created_dts;
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

COMMENT ON FUNCTION audit.if_modified IS 'This trigger function is responsible for writing entries to the audit.change, and the translated_audit_queue if a record set has been modified. It will look for a diff between the old and new values, and if so write an entry. It starts with hStores to do the diff comparison, but converts the changes to a jsonB that has the name of the field, as well as the old and new values.';
