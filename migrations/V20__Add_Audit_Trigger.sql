CREATE FUNCTION audit.if_modified() RETURNS TRIGGER AS $audit_table$
DECLARE
    audit_row audit.change;
    include_values boolean;
    log_diffs boolean;
    h_old hstore;
    h_new hstore;
    table_id int;
    excluded_cols text[] = ARRAY[]::text[];
	pkey_f TEXT;
    fkey_f TEXT;
    created_by_f TEXT;
    modified_by_f TEXT;
    h_changed HSTORE;
    unchanged_keys text[] = ARRAY[]::text[];
BEGIN

    IF TG_WHEN <> 'AFTER' THEN
        RAISE EXCEPTION 'audit.audit_trigger() may only run as an AFTER trigger';
    END IF;
    
    SELECT 
    id,
    ignored_fields,
    created_by_field,
    modified_by_field,
    pkey_field,
    fkey_field
    INTO
    table_id,
    excluded_cols,
    created_by_f,
    modified_by_f,
    pkey_f,
    fkey_f
    FROM audit.table_config
    WHERE schema =TG_TABLE_SCHEMA::text AND name = TG_TABLE_NAME::text;
    h_old= hstore(OLD.*);
    h_new= hstore(NEW.*);

    audit_row = ROW (
    nextval('audit.change_id_seq'), --id ---TODO make this happen after the check to skip, we don't want to increment the series otherwise
        table_id, --table_id
        NEW.id, --primary_key
        NULL, --foreign_key
        substring(TG_OP,1,1), --action
        NULL, --old
        NULL, --new
        NULL, --fields
        NEW.modified_by, --modified_by
        CURRENT_TIMESTAMP --modified_dts
    );
    IF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN
        audit_row.primary_key = h_new -> pkey_f;
        audit_row.foreign_key = h_new -> fkey_f;
        -- audit_row.old = hstore(OLD.*) - excluded_cols;
        audit_row.new =  (h_new - h_old) - excluded_cols; --remove matching values and excluded columns
        unchanged_keys = akeys(h_old - akeys(audit_row.new));
        audit_row.old = h_old - unchanged_keys; --remove any key not in new

        WITH NEWval AS
        (
            SELECT (EACH(audit_row.new)).*
            --FROM audit_row
        )
        ,RESULTSet AS 
        (
            SELECT 
            NEWval.key AS field,
            NEWval.value AS new,
            audit_row.old -> NEWval.key AS old

            FROM NEWval
        )
        SELECT jsonb_object_agg(field,(to_jsonb(r) - 'field'))
        INTO audit_row.fields
            FROM RESULTSet r;
        IF audit_row.new = hstore('') THEN
            -- All changed fields are ignored. Skip this update.
            RETURN NULL;
        END IF;
    ELSIF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
        audit_row.modified_by = OLD.modified_by; --Should this be the case?
        audit_row.primary_key = h_old -> pkey_f;
        audit_row.foreign_key = h_old -> fkey_f;
        audit_row.old = hstore(OLD.*) - excluded_cols;
    ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
        audit_row.primary_key = h_new -> pkey_f;
        audit_row.foreign_key = h_new -> fkey_f;
        audit_row.modified_by = NEW.created_by;
        audit_row.modified_dts = NEW.created_dts;
        audit_row.new = hstore(NEW.*) - excluded_cols;
    END IF;

    INSERT INTO audit.change VALUES(audit_row.*);
    RETURN NULL;



END;
$audit_table$ LANGUAGE plpgsql
SECURITY DEFINER --Run trigger as the creator of the trigger
SET search_path = pg_catalog, public;
