WITH flatLinks AS (
    SELECT
        model_plan_id,
        UNNEST(resembles_existing_model_which) AS resemblesID
    FROM plan_general_characteristics
),

matchedLinks AS (
    SELECT
        flatLinks.model_plan_id,
        flatLinks.resemblesID,
        existing_model.id AS existing_model_id,
        existing_model.model_name AS existing_model_name,
        model_plan.id AS current_model_plan_id,
        model_plan.model_name AS current_model_name,
        '00000001-0001-0001-0001-000000000001'::UUID AS created_by -- MINT SYSTEM ACCOUNT, as we can't be sure who selected these (unless getting more complicatd and looking at the audit table)
    FROM flatLinks
    LEFT JOIN existing_model ON flatLinks.resemblesID = CAST( existing_model.id AS TEXT)
    LEFT JOIN model_plan ON flatLinks.resemblesID = CAST(model_plan.id AS TEXT)
)

/* Use the view to insert links*/
INSERT INTO existing_model_link(id, model_plan_id, existing_model_id, current_model_plan_id, created_by)
SELECT
    GEN_RANDOM_UUID() AS id,
    matchedLinks.model_plan_id,
    matchedLinks.existing_model_id,
    matchedLinks.current_model_plan_id,
    matchedLinks.created_by
FROM matchedLinks
WHERE (matchedLinks.current_model_plan_id IS NOT NULL OR matchedLinks.existing_model_id IS NOT NULL);

ALTER TABLE plan_general_characteristics DROP COLUMN resembles_existing_model_which;
