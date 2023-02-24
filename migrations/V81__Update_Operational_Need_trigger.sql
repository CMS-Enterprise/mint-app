CREATE OR REPLACE FUNCTION public.SET_OPERATIONAL_NEED_NEEDED() RETURNS TRIGGER AS $body$
DECLARE
    h_old hstore;
    h_new hstore;
    modified_by_id UUID;
    h_changed HSTORE;
BEGIN

    IF TG_WHEN <> 'AFTER' OR TG_OP <> 'UPDATE'THEN
        RAISE EXCEPTION 'public.SET_OPERATIONAL_NEED_NEEDED() may only run AS an AFTER trigger for UPDATE statements';
    END IF;
    


    h_new= hstore(NEW.*);
    h_old= hstore(OLD.*);
    h_changed = (h_new - h_old);
    modified_by_id = h_new -> 'modified_by';
With NeedUpdates AS (
    SELECT * FROM get_Need_Needed(TG_TABLE_NAME::text,h_changed)
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
