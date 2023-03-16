CREATE OR REPLACE FUNCTION DETERMINE_SECTION_NEEDS( table_name TEXT, model_plan_idParam UUID, h_new HSTORE, changedKeys TEXT[] DEFAULT '{*}'::TEXT[] )
RETURNS TABLE (
    operational_need_id UUID,
    need_type INT,
    need_key OPERATIONAL_NEED_KEY,
    trigger_col TEXT[],
    trigger_vals TEXT[],
    retVals TEXT[],
    model_plan_id UUID,
    needed BOOLEAN
)
AS $$
	BEGIN 
	-- RAISE NOTICE 'DETERMINE_SECTION_NEEDS called.  table_name % and  hstore = %', table_name,h_new;
	RETURN QUERY
    WITH NeedConditions AS
    (
        SELECT 
        possible_operational_need.id,
	    possible_operational_need.need_key,
        possible_operational_need.trigger_col,
        possible_operational_need.trigger_vals
    FROM public.possible_operational_need
    WHERE possible_operational_need.trigger_table = table_name AND ((changedKeys && possible_operational_need.trigger_col) OR changedKeys = '{*}'::TEXT[])-- Only get needs where the column has changes (eg there is overlap in these values)
    ),
	normalNeeds AS
    (
    SELECT
    NeedConditions.id,
    NeedConditions.need_key,
    NeedConditions.trigger_col,
    NeedConditions.trigger_vals,
	model_plan_idParam AS model_plan_id,
    (h_new -> NeedConditions.trigger_col)::TEXT[] AS vals, 
    starts_with(((h_new -> NeedConditions.trigger_col)::TEXT[])[1], '{') AS nested
    FROM NeedConditions
    ),
    Combined AS
	(
		SELECT
		normalNeeds.id,
		normalNeeds.need_key,
        normalNeeds.trigger_col,
        normalNeeds.trigger_vals,
		normalNeeds.model_plan_id,
		unnest(vals)::TEXT[] AS vals --If it has a nested array, unnest it
		FROM normalNeeds
		WHERE nested = true

        UNION
		SELECT
		normalNeeds.id,
		normalNeeds.need_key,
        normalNeeds.trigger_col,
        normalNeeds.trigger_vals,
		normalNeeds.model_plan_id,
		vals::TEXT[] AS vals
		FROM
		normalNeeds WHERE nested = false OR nested IS null --false and null
	),
    NeedUpdates AS
    (
        SELECT
		Combined.id,
		Combined.need_key,
        Combined.trigger_col,
        Combined.trigger_vals,
		vals,
		Combined.model_plan_id,
		CASE
			WHEN vals::TEXT[] = '{NULL}' THEN NULL --distinguish if vals are null, means not answered yet
			ELSE(vals && Combined.trigger_vals)
		END
		AS needed
		FROM Combined
    )
	
	SELECT 
	operational_need.ID,
	operational_need.need_type,
	NeedUpdates.need_key,
	NeedUpdates.trigger_col,
	NeedUpdates.trigger_vals,
	NeedUpdates.vals,
	NeedUpdates.model_plan_id,
	NeedUpdates.needed
	from NeedUpdates
	LEFT JOIN operational_need on operational_need.model_plan_id = NeedUpdates.model_plan_id AND operational_need.need_type = NeedUpdates.id
	ORDER BY operational_need.need_type;


	END; $$
LANGUAGE 'plpgsql';
COMMENT ON FUNCTION DETERMINE_SECTION_NEEDS IS
'This function analyzes a change set to see if a need is needed or not
It first casts the rows at h_stores and compares which fields have changed. If any of the changed fields match (?|) a value from trigger_cols it gets inserted in NeedConditions CTE.
From there, it checks all the current values (NEW) for the trigger col, and checks if any of them satisfy the trigger_vals (&&). 
If it does, the need is set to needed = true, else needed = false.';

    -- SELECT 	* FROM	DETERMINE_SECTION_NEEDS('plan_participants_and_providers',
    -- 						(SELECT hstore(PPP) FROM plan_participants_and_providers AS ppp WHERE ppp.model_plan_id = 'f8f4a93a-bf67-41f7-860e-da44ecd38fc9'))
