CREATE OR REPLACE FUNCTION public.SET_OPERATIONAL_NEED_NEEDED() RETURNS TRIGGER AS $body$
DECLARE
    h_old hstore;
    h_new hstore;
    modified_by_id UUID;
    model_plan_id UUID;
    h_changed HSTORE;
    h_changedKeys text[];
    h_changedCurrent HSTORE; --To hold the current value of the columns that have changed
BEGIN

    IF TG_WHEN <> 'AFTER' OR TG_OP <> 'UPDATE'THEN
        RAISE EXCEPTION 'public.SET_OPERATIONAL_NEED_NEEDED() may only run AS an AFTER trigger for UPDATE statements';
    END IF;
    


    h_new= hstore(NEW.*);
    h_old= hstore(OLD.*);
    h_changed = (h_new - h_old);
    h_changedKeys = akeys(h_changed); --Get the keys that have changed
    h_changedCurrent = slice(h_new,h_changedKeys);


    modified_by_id = h_new -> 'modified_by';
    model_plan_id = h_new -> 'model_plan_id';
    RAISE NOTICE 'SET_OPERATIONAL_NEED_NEEDED called.  Modified_by_id %, model_plan_id = % and  hstore = %', Modified_by_id,model_plan_id, h_changedCurrent;
With NeedUpdates AS (
    SELECT * FROM DETERMINE_SECTION_NEEDS(TG_TABLE_NAME::text, model_plan_id, h_changedCurrent)
)

UPDATE operational_need
SET
needed = NeedUpdates.needed,
modified_by = modified_by_id,
modified_dts = CURRENT_TIMESTAMP
FROM NeedUpdates
WHERE operational_need.id = NeedUpdates.operational_need_id;
    RETURN NULL;



END;
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION SET_OPERATIONAL_NEED_NEEDED IS
'This trigger looks at the results from get_Need_Needed, and in turns updates the operational needs corresponding to the result. An empty value set results in a needed == null result';
