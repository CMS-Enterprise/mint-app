-- DROP FUNCTION get_Need_Needed
CREATE OR REPLACE FUNCTION get_Need_Needed( table_name text, h_changed hstore )
	RETURNS TABLE (
		id int, --TODO, do we want to return the UUID of the actual operational need? Or just the ID of the possible need?
		need_key OPERATIONAL_NEED_KEY,
		trigger_col text[],
		trigger_vals text[],
		retVals text[],
		model_plan_id UUID,
		needed BOOLEAN
	)
	AS $$
	BEGIN RETURN QUERY
    WITH NeedConditions AS
    (
        SELECT 
        possible_operational_need.id,
	    possible_operational_need.need_key,
        possible_operational_need.trigger_col,
        possible_operational_need.trigger_vals
    FROM public.possible_operational_need
    WHERE possible_operational_need.trigger_table = table_name AND h_changed ?| possible_operational_need.trigger_col -- Only get needs where the column has changes
    ),
	normalNeeds AS
    (
    SELECT
    NeedConditions.id,
    NeedConditions.need_key,
    NeedConditions.trigger_col,
    NeedConditions.trigger_vals,
    (h_changed -> 'model_plan_id')::UUID AS model_plan_id,
--     h_changed -> 'modified_by' AS modified_by,
    (h_changed -> NeedConditions.trigger_col)::TEXT[] AS vals,
    starts_with(((h_changed -> NeedConditions.trigger_col)::TEXT[])[1], '{') AS nested
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
-- 		normalNeeds.modified_by,
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
-- 		normalNeeds.modified_by,
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
	
	SELECT * from NeedUpdates;


	END; $$
LANGUAGE 'plpgsql';

	-- SELECT 	* FROM	get_Need_Needed('plan_participants_and_providers',
	-- 						(SELECT hstore(PPP) FROM plan_participants_and_providers AS ppp WHERE ppp.model_plan_id = 'f8f4a93a-bf67-41f7-860e-da44ecd38fc9'))