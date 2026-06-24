WITH queried_ids AS (
    SELECT UNNEST(CAST(:ctat_request_ids AS UUID[])) AS ctat_request_id
)

SELECT
    link.ctat_request_id,
    plan.id,
    plan.model_name,
    plan.abbreviation,
    plan.archived,
    plan.status,
    plan.previous_suggested_phase,
    plan.created_by,
    plan.created_dts,
    plan.modified_by,
    plan.modified_dts
FROM queried_ids AS queried
INNER JOIN ctat_request_model_plan_link AS link
    ON link.ctat_request_id = queried.ctat_request_id
INNER JOIN model_plan AS plan
    ON plan.id = link.model_plan_id
ORDER BY link.created_dts ASC, link.id ASC;
