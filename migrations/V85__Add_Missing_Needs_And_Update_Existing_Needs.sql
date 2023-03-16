/* Find  Missing Needs, and insert them */

WITH modelPlanNeedTable AS ( -- All Needs for existing models
    SELECT
        PoPn.id AS possible_operational_need_id,
        model_plan.id AS model_plan_id,
        model_plan.created_by

    FROM model_plan
    LEFT JOIN possible_operational_need AS PoPn ON PoPn.id = PoPn.id
    ORDER BY model_plan_id, possible_operational_need_id
),

missingNeeds AS ( -- Needs that don't have an inserted record
    SELECT
        modelPlanNeedTable.possible_operational_need_id,
        modelPlanNeedTable.model_plan_id,
        modelPlanNeedTable.created_by
    FROM modelPlanNeedTable
    LEFT JOIN operational_need AS OpN ON OpN.need_type = modelPlanNeedTable.possible_operational_need_id AND OpN.model_plan_id = modelPlanNeedTable.model_plan_id
    WHERE OpN.id IS NULL
)

INSERT INTO operational_need(
    id,
    model_plan_id,
    need_type,
    created_by,
    created_dts
)
SELECT
    gen_random_uuid() AS id,
    missingNeeds.model_plan_id AS model_plan_id,
    missingNeeds.possible_operational_need_id AS need_type,
    missingNeeds.created_by AS created_by,
    current_timestamp AS created_dts
FROM missingNeeds;


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
