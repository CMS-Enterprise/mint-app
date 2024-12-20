CREATE OR REPLACE FUNCTION DETERMINE_MTO_MILESTONE_SUGGESTIONS( table_name TEXT, model_plan_idParam UUID, h_new HSTORE, changedKeys TEXT[] DEFAULT '{*}'::TEXT[] )
RETURNS TABLE (
    key MTO_COMMON_MILESTONE_KEY,
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
	    mto_common_milestone.key,
        mto_common_milestone.trigger_col,
        mto_common_milestone.trigger_vals
    FROM public.mto_common_milestone
    WHERE mto_common_milestone.trigger_table = table_name AND ((changedKeys && mto_common_milestone.trigger_col) OR changedKeys = '{*}'::TEXT[])-- Only get milestones where the column has changes (eg there is overlap in these values)
    ),
	singleMilestones AS
	-- Isolate Milestones that are suggested based on a single column value vs nested, 
    (
    SELECT
    SuggestionConditions.key,
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
		singleMilestones.key,
        singleMilestones.trigger_col,
        singleMilestones.trigger_vals,
		singleMilestones.model_plan_id,
		unnest(vals)::TEXT[] AS vals --If it has a nested array, unnest it
		FROM singleMilestones
		WHERE nested = true

        UNION
		SELECT
		singleMilestones.key,
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
		Combined.key,
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
	MilestoneSuggestion.key,
	MilestoneSuggestion.trigger_col,
	MilestoneSuggestion.trigger_vals,
	MilestoneSuggestion.vals,
	MilestoneSuggestion.model_plan_id,
	MilestoneSuggestion.suggested
	from MilestoneSuggestion
	ORDER BY MilestoneSuggestion.key;


	END; $$
LANGUAGE 'plpgsql';
COMMENT ON FUNCTION DETERMINE_MTO_MILESTONE_SUGGESTIONS IS
'This function analyzes a change set to see if a milestone should be suggested or not
It first casts the rows at h_stores and compares which fields have changed. If any of the changed fields match (?|) a value from trigger_cols it gets inserted in SuggestionConditions CTE.
From there, it checks all the current values (NEW) for the trigger col, and checks if any of them satisfy the trigger_vals (&&). 
If it does, the milestone is set to suggested = true, else suggested = false.';
-- SELECT 	* FROM	DETERMINE_MTO_MILESTONE_SUGGESTIONS('plan_participants_and_providers',
-- 						(SELECT hstore(PPP) FROM plan_participants_and_providers AS ppp WHERE ppp.model_plan_id = 'f8f4a93a-bf67-41f7-860e-da44ecd38fc9'))
