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
        RAISE EXCEPTION 'public.SET_OPERATIONAL_NEED_NEEDED() may only run AS an AFTER trigger for UPDATE statements';
    END IF;
    


    h_new= hstore(NEW.*);
    h_old= hstore(OLD.*);
    h_changed = (h_new - h_old);
    WITH NeedConditions AS
    (
        SELECT 
        id,
	    need_key,
        trigger_col,
        trigger_vals
    FROM public.possible_operational_need
    WHERE trigger_table = TG_TABLE_NAME::text AND h_changed ?| trigger_col -- Only get needs where the column has changes
    ),
    normalNeeds AS
    (
    SELECT
    id,
    need_key,
    trigger_col,
    trigger_vals,
    (h_new -> 'model_plan_id')::UUID AS model_plan_id,
    h_new -> 'modified_by' AS modified_by,
    (h_new -> trigger_col)::TEXT[] AS vals,
    starts_with(((h_new -> trigger_col)::TEXT[])[1], '{') AS nested
    FROM NeedConditions
    ),
    Combined AS
	(
		SELECT
		id,
		need_key,
        trigger_col,
        trigger_vals,
		model_plan_id,
		modified_by,
		unnest(vals)::TEXT[] AS vals --If it has a nested array, unnest it
		FROM normalNeeds
		WHERE nested = true

        UNION
		SELECT
		id,
		need_key,
        trigger_col,
        trigger_vals,
		model_plan_id,
		modified_by,
		vals::TEXT[] AS vals
		FROM
		normalNeeds WHERE nested = false
	),
    NeedUpdates AS
    (
        SELECT
		id,
		need_key,
        trigger_col,
        trigger_vals,
		model_plan_id,
		modified_by,
		(vals && trigger_vals) AS needed
		FROM Combined
    )
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
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION SET_OPERATIONAL_NEED_NEEDED IS
'This trigger looks at the configuration in the Possible Operational need table and sets a need AS needed or not based on values in the row.
It first casts the rows at h_stores and compares which fields have changed. If any of the changed fields match (?|) a value from trigger_cols it gets inserted in NeedConditions CTE.
From there, it checks all the current values (NEW) for the trigger col, and checks if any of them satisfy the trigger_vals (&&). 
If it does, the need is set to needed = true, else needed = false.';
