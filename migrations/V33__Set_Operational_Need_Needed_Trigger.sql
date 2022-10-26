CREATE FUNCTION public.SET_OPERATIONAL_NEED_NEEDED() RETURNS TRIGGER AS $body$
DECLARE
    h_old hstore;
    h_new hstore;
    excluded_cols text[] = ARRAY[]::text[];
    insert_cols text[] = ARRAY[]::text[];
	pkey_f TEXT;
    fkey_f TEXT;
    created_by_f TEXT;
    modified_by_f TEXT;
    h_changed HSTORE;
    diff_keys text[] = ARRAY[]::text[];
BEGIN

    IF TG_WHEN <> 'AFTER' OR TG_OP <> 'UPDATE'THEN
        RAISE EXCEPTION 'public.SET_OPERATIONAL_NEED_NEEDED() may only run as an AFTER trigger for UPDATE statements';
    END IF;
    


    h_new= hstore(NEW.*);
    h_old= hstore(OLD.*);
    h_changed = (h_new - h_old);
    CREATE TEMP TABLE NeedConditions AS
        SELECT 
        id,
	    need_key,
        trigger_col,
        trigger_vals
    FROM public.possible_operational_need
    WHERE trigger_table = TG_TABLE_NAME::text AND h_changed ?| trigger_col; -- Only get needs where the column has changes
--TODO return if no rows

CREATE TEMP TABLE NeedUpdates AS
    SELECT
    id,
    need_key,
    (h_new -> 'model_plan_id')::UUID as model_plan_id,
    h_new -> 'modified_by' as modified_by,
    (h_changed -> trigger_col && trigger_vals) as needed -- This checks if it has values in common, EG overlap

    FROM NeedConditions;

-- UPDATE based on the above query results 
UPDATE operational_need
SET
needed = NeedUpdates.needed,
modified_by = NeedUpdates.modified_by,
modified_dts = CURRENT_TIMESTAMP
FROM NeedUpdates
WHERE operational_need.model_plan_id = NeedUpdates.model_plan_id AND operational_need.need_type = NeedUpdates.id;
    RETURN NULL;



END;
$body$ LANGUAGE plpgsql
