CREATE FUNCTION public.SET_SUGGESTED_MTO_MILESTONE() RETURNS TRIGGER AS $body$
DECLARE
    h_old hstore;
    h_new hstore;
    modified_by_id UUID;
    plan_id UUID;
    h_changed HSTORE;
    changedKeys text[];
BEGIN

    IF TG_WHEN <> 'AFTER' OR TG_OP <> 'UPDATE'THEN
        RAISE EXCEPTION 'public.SET_SUGGESTED_MTO_MILESTONE() may only run AS an AFTER trigger for UPDATE statements';
    END IF;
    


    h_new= hstore(NEW.*);
    h_old= hstore(OLD.*);
    h_changed = (h_new - h_old);
    changedKeys = akeys(h_changed); --Get the keys that have changed

    modified_by_id = h_new -> 'modified_by';
    plan_id = h_new -> 'model_plan_id';
    -- RAISE NOTICE 'SET_SUGGESTED_MTO_MILESTONE called.  Modified_by_id %, model_plan_id = % and  hstore = %', Modified_by_id, plan_id, h_new;
With SuggestedMilestones AS (
    SELECT key,model_plan_id, suggested  FROM DETERMINE_MTO_MILESTONE_SUGGESTIONS(TG_TABLE_NAME::text, plan_id, h_new, changedKeys) --need to pass the hstore of the entire row to handle composite column trigger conditions
)

-- insert unmatched suggestions. Delete old suggestions 
MERGE INTO mto_suggested_milestone AS target
USING SuggestedMilestones AS source
ON target.mto_common_milestone_key = source.key
   AND target.model_plan_id = source.model_plan_id

WHEN MATCHED AND COALESCE(source.suggested, FALSE) <> TRUE THEN --Delete if it is not true. We use the COALESCE to also convert NULL to false
    DELETE

-- insert records that are now not suggested
WHEN NOT MATCHED AND source.suggested = TRUE THEN
    INSERT (id, mto_common_milestone_key, model_plan_id, created_by)
    VALUES (gen_random_uuid(), source.key, source.model_plan_id, modified_by_id);
    RETURN NULL;



END;
$body$ LANGUAGE plpgsql;
