/* Call Function with a cross Join lateral  to get the result for each need */

WITH NeedUpdates AS (

    SELECT OpNeeds.* FROM model_plan mp, DETERMINE_MODEL_PLAN_NEEDS(mp.id) AS OpNeeds --noqa
)



UPDATE operational_need
SET
    needed = NeedUpdates.needed,
    modified_by = '00000001-0001-0001-0001-000000000001', --System account
    modified_dts = CURRENT_TIMESTAMP
FROM NeedUpdates
WHERE operational_need.id = NeedUpdates.operational_need_id;
