WITH flat AS (
    SELECT
        model_plan_id,
        UNNEST(resembles_existing_model_which) AS resemblesID
    FROM plan_general_characteristics
),

matched AS (
    SELECT
        flat.model_plan_id,
        flat.resemblesID,
        existing_model.id AS existing_model_id,
        existing_model.model_name AS existing_model_name,
        model_plan.id AS current_model_plan_id,
        model_plan.model_name AS current_model_name,
        '00000001-0001-0001-0001-000000000001'::UUID AS created_by -- MINT SYSTEM ACCOUNT, as we can't be sure who selected these (unless getting more complicatd and looking at the audit table)
    FROM flat
    LEFT JOIN existing_model ON flat.resemblesID = CAST( existing_model.id AS TEXT)
    LEFT JOIN model_plan ON flat.resemblesID = CAST(model_plan.id AS TEXT)
)

/* Use the view to insert links*/
INSERT INTO existing_model_link(id, model_plan_id, existing_model_id, current_model_plan_id, created_by)
SELECT
    GEN_RANDOM_UUID() AS id,
    matched.model_plan_id,
    matched.existing_model_id,
    matched.current_model_plan_id,
    matched.created_by
FROM matched;

ALTER TABLE plan_general_characteristics DROP COLUMN resembles_existing_model_which;
