CREATE OR REPLACE FUNCTION DETERMINE_MODEL_PLAN_MTO_SUGGESTIONS(model_plan_idParam UUID)
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
	RETURN QUERY
    WITH AllNeeds AS 
    (
        SELECT 	* FROM	DETERMINE_MTO_MILESTONE_SUGGESTIONS('plan_ops_eval_and_learning',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_ops_eval_and_learning AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
        UNION
        SELECT 	* FROM	DETERMINE_MTO_MILESTONE_SUGGESTIONS('plan_participants_and_providers',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_participants_and_providers AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
        UNION
        SELECT 	* FROM	DETERMINE_MTO_MILESTONE_SUGGESTIONS('plan_payments',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_payments AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
        UNION
        SELECT 	* FROM	DETERMINE_MTO_MILESTONE_SUGGESTIONS('plan_beneficiaries',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_beneficiaries AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
        UNION
        SELECT 	* FROM	DETERMINE_MTO_MILESTONE_SUGGESTIONS('plan_general_characteristics',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_general_characteristics AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
    )
   SELECT * FROM AllNeeds ORDER BY key;


	END; $$
LANGUAGE 'plpgsql';
COMMENT ON FUNCTION DETERMINE_MODEL_PLAN_MTO_SUGGESTIONS IS
'This function looks at all the relevant tables for a model plan and returns data about if an common milestone is suggested or not';
