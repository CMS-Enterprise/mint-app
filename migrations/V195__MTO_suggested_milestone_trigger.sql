-- DECLARE
--     h_old hstore;
--     h_new hstore;
--     modified_by_id UUID;
--     model_plan_id UUID;
--     h_changed HSTORE;
--     changedKeys text[];
-- BEGIN

--     IF TG_WHEN <> 'AFTER' OR TG_OP <> 'UPDATE'THEN
--         RAISE EXCEPTION 'public.SET_OPERATIONAL_NEED_NEEDED() may only run AS an AFTER trigger for UPDATE statements';
--     END IF;
    


--     h_new= hstore(NEW.*);
--     h_old= hstore(OLD.*);
--     h_changed = (h_new - h_old);
--     changedKeys = akeys(h_changed); --Get the keys that have changed

--     modified_by_id = h_new -> 'modified_by';
--     model_plan_id = h_new -> 'model_plan_id';
--     -- RAISE NOTICE 'SET_OPERATIONAL_NEED_NEEDED called.  Modified_by_id %, model_plan_id = % and  hstore = %', Modified_by_id,model_plan_id, h_new;
-- With SuggestedMilestone AS (
--     SELECT * FROM DETERMINE_MTO_MILESTONE_SUGGESTIONS(TG_TABLE_NAME::text, model_plan_id, h_new, changedKeys) --need to pass the hstore of the entire row to handle composite column trigger conditions
-- )
-- --  TODO return the suggestions. Insert suggested, delete the un suggested 


-- -- UPDATE operational_need
-- -- SET
-- -- needed = NeedUpdates.needed,
-- -- modified_by = modified_by_id,
-- -- modified_dts = CURRENT_TIMESTAMP
-- -- FROM NeedUpdates
-- -- WHERE operational_need.id = NeedUpdates.operational_need_id;
--     RETURN NULL;



-- END;
