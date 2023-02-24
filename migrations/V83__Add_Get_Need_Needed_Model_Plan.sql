/* Set needs to account for new needs */
CREATE OR REPLACE FUNCTION GET_NEED_NEEDED_MODEL_PLAN(model_plan_idParam UUID)
RETURNS TABLE (
    operational_need_id UUID,
    need_key OPERATIONAL_NEED_KEY,
    trigger_col TEXT[],
    trigger_vals TEXT[],
    retVals TEXT[],
    model_plan_id UUID,
    needed BOOLEAN
)
AS $$
	BEGIN 
	RETURN QUERY
    WITH AllNeeds AS 
    (
        SELECT 	* FROM	GET_NEED_NEEDED('plan_ops_eval_and_learning',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_ops_eval_and_learning AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
        UNION
        SELECT 	* FROM	GET_NEED_NEEDED('plan_participants_and_providers',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_participants_and_providers AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
        UNION
        SELECT 	* FROM	GET_NEED_NEEDED('plan_payments',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_payments AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
        UNION
        SELECT 	* FROM	GET_NEED_NEEDED('plan_beneficiaries',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_beneficiaries AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
        UNION
        SELECT 	* FROM	GET_NEED_NEEDED('plan_general_characteristics',
                model_plan_idParam,
                (SELECT hstore(PPP) FROM plan_general_characteristics AS ppp WHERE ppp.model_plan_id = model_plan_idParam))
    )
   SELECT * FROM AllNeeds;


	END; $$
LANGUAGE 'plpgsql';
COMMENT ON FUNCTION GET_NEED_NEEDED_MODEL_PLAN IS
'This function looks at all the needs for a model plan and returns data about if the operational need is needed';
