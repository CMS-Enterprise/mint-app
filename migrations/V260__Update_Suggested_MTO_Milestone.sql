DROP FUNCTION DETERMINE_MTO_MILESTONE_SUGGESTIONS(TEXT, UUID, HSTORE, TEXT[]);

CREATE FUNCTION DETERMINE_MTO_MILESTONE_SUGGESTIONS( table_name TEXT, model_plan_idParam UUID, h_new HSTORE, changedKeys TEXT[] DEFAULT '{*}'::TEXT[] )
RETURNS TABLE (
    mto_common_milestone_id UUID,
    trigger_col TEXT[],
    trigger_vals TEXT[],
    retVals TEXT[],
    model_plan_id UUID,
    suggested BOOLEAN
)
AS $$
	BEGIN 
	-- RAISE NOTICE 'DETERMINE_MTO_MILESTONE_SUGGESTIONS called.  table_name % and  hstore = %', table_name,h_new;
	RETURN QUERY
    WITH SuggestionConditions AS
	-- First query the suggestion conditions from the common milestone table, based on the changed table_name
    (
        SELECT 
	    mto_common_milestone.id as mto_common_milestone_id,
        mto_common_milestone.trigger_col,
        mto_common_milestone.trigger_vals
    FROM public.mto_common_milestone
    WHERE mto_common_milestone.trigger_table = table_name AND ((changedKeys && mto_common_milestone.trigger_col) OR changedKeys = '{*}'::TEXT[])-- Only get milestones where the column has changes (eg there is overlap in these values)
    ),
	singleMilestones AS
	-- Isolate Milestones that are suggested based on a single column value vs nested, 
    (
    SELECT
    SuggestionConditions.mto_common_milestone_id,
    SuggestionConditions.trigger_col,
    SuggestionConditions.trigger_vals,
	model_plan_idParam AS model_plan_id,
    (h_new -> SuggestionConditions.trigger_col)::TEXT[] AS vals, 
    starts_with(((h_new -> SuggestionConditions.trigger_col)::TEXT[])[1], '{') AS nested
    FROM SuggestionConditions
    ),
    Combined AS
	(
		SELECT
		singleMilestones.mto_common_milestone_id,
        singleMilestones.trigger_col,
        singleMilestones.trigger_vals,
		singleMilestones.model_plan_id,
		unnest(vals)::TEXT[] AS vals --If it has a nested array, unnest it
		FROM singleMilestones
		WHERE nested = true

        UNION
		SELECT
		singleMilestones.mto_common_milestone_id,
        singleMilestones.trigger_col,
        singleMilestones.trigger_vals,
		singleMilestones.model_plan_id,
		vals::TEXT[] AS vals
		FROM
		singleMilestones WHERE nested = false OR nested IS null --false and null
	),
    MilestoneSuggestion AS
	-- Do the final suggestion on the milestone. An unanswered question is distinguished with null instead of making it false
    (
        SELECT
		Combined.mto_common_milestone_id,
        Combined.trigger_col,
        Combined.trigger_vals,
		vals,
		Combined.model_plan_id,
		CASE
			WHEN vals::TEXT[] = '{NULL}' THEN NULL --distinguish if vals are null, means not answered yet, or it was unset
			ELSE(vals && Combined.trigger_vals)
		END
		AS suggested
		FROM Combined
    )
	-- Return the data
	SELECT 
	MilestoneSuggestion.mto_common_milestone_id,
	MilestoneSuggestion.trigger_col,
	MilestoneSuggestion.trigger_vals,
	MilestoneSuggestion.vals,
	MilestoneSuggestion.model_plan_id,
	MilestoneSuggestion.suggested
	from MilestoneSuggestion
	ORDER BY MilestoneSuggestion.mto_common_milestone_id;


	END; $$
LANGUAGE 'plpgsql';
COMMENT ON FUNCTION DETERMINE_MTO_MILESTONE_SUGGESTIONS IS
'This function analyzes a change set to see if a milestone should be suggested or not
It first casts the rows at h_stores and compares which fields have changed. If any of the changed fields match (?|) a value from trigger_cols it gets inserted in SuggestionConditions CTE.
From there, it checks all the current values (NEW) for the trigger col, and checks if any of them satisfy the trigger_vals (&&). 
If it does, the milestone is set to suggested = true, else suggested = false.';
-- SELECT 	* FROM	DETERMINE_MTO_MILESTONE_SUGGESTIONS('plan_participants_and_providers',
-- 						(SELECT hstore(PPP) FROM plan_participants_and_providers AS ppp WHERE ppp.model_plan_id = 'f8f4a93a-bf67-41f7-860e-da44ecd38fc9'))


CREATE OR REPLACE FUNCTION public.SET_SUGGESTED_MTO_MILESTONE() RETURNS TRIGGER AS $body$
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
    SELECT mto_common_milestone_id, model_plan_id, suggested  
    FROM DETERMINE_MTO_MILESTONE_SUGGESTIONS(TG_TABLE_NAME::text, plan_id, h_new, changedKeys) --need to pass the hstore of the entire row to handle composite column trigger conditions
)

-- insert unmatched suggestions. Delete old suggestions 
MERGE INTO mto_suggested_milestone AS target
USING SuggestedMilestones AS source
ON target.mto_common_milestone_id = source.mto_common_milestone_id
   AND target.model_plan_id = source.model_plan_id

WHEN MATCHED AND COALESCE(source.suggested, FALSE) <> TRUE THEN --Delete if it is not suggested (true). We use the COALESCE to also convert NULL to false
    DELETE

-- insert records that are now not suggested
WHEN NOT MATCHED AND source.suggested = TRUE THEN
    INSERT (id, mto_common_milestone_id, model_plan_id, created_by)
    VALUES (gen_random_uuid(), source.mto_common_milestone_id, source.model_plan_id, modified_by_id);
    RETURN NULL;



END;
$body$ LANGUAGE plpgsql;

COMMENT ON FUNCTION SET_SUGGESTED_MTO_MILESTONE IS ' This trigger calls DETERMINE_MTO_MILESTONE_SUGGESTIONS to figure out if the changes made in a specific table
indicate that a milestone would be suggested for a model plan. It does a merge statement to conditionally insert or delete records as they are suggested.';
