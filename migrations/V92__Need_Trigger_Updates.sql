
/* Update existing needs */
UPDATE possible_operational_need
SET
    
    trigger_table = 'plan_general_characteristics', --same as previous
    trigger_col = '{plan_contract_updated}',
    trigger_vals = '{t}',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = current_timestamp

WHERE need_key = 'UPDATE_CONTRACT';



UPDATE possible_operational_need
SET
    trigger_table = 'plan_ops_eval_and_learning', --same as previous
    trigger_col = '{model_learning_systems}',  --same as previous
    trigger_vals = '{LEARNING_CONTRACTOR, IT_PLATFORM_CONNECT, PARTICIPANT_COLLABORATION, EDUCATE_BENEFICIARIES, OTHER}',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = current_timestamp

WHERE need_key = 'EDUCATE_BENEF';



/* Update all needs with this logic */


/* Call Function with a cross Join lateral  to get the result for each need */

WITH NeedUpdates AS (

    SELECT OpNeeds.* FROM model_plan mp, DETERMINE_MODEL_PLAN_NEEDS(mp.id) AS OpNeeds --noqa
)



UPDATE operational_need
SET
    needed = NeedUpdates.needed,
    modified_by = '00000001-0001-0001-0001-000000000001', --System account
    modified_dts = current_timestamp
FROM NeedUpdates
WHERE operational_need.id = NeedUpdates.operational_need_id;
