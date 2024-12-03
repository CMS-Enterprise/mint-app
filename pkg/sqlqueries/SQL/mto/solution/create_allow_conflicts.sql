WITH insert_attempt AS (
    INSERT INTO mto_solution (
        id,
        model_plan_id,
        mto_common_solution_key,
        name,
        type,
        facilitated_by,
        needed_by,
        status,
        risk_indicator,
        poc_name,
        poc_email,
        created_by
    )
    VALUES (
        :id,
        :model_plan_id,
        :mto_common_solution_key,
        :name,
        :type,
        :facilitated_by,
        :needed_by,
        :status,
        :risk_indicator,
        :poc_name,
        :poc_email,
        :created_by
    )
    ON CONFLICT DO NOTHING
    RETURNING *
)

SELECT
    id,
    model_plan_id,
    mto_common_solution_key,
    name,
    type,
    facilitated_by,
    needed_by,
    status,
    risk_indicator,
    poc_name,
    poc_email,
    created_by
FROM insert_attempt
UNION ALL
SELECT
    mto_solution.id,
    mto_solution.model_plan_id,
    mto_solution.mto_common_solution_key,
    COALESCE(mto_solution.name, mto_common_solution.name) AS "name",
    COALESCE(mto_solution.type, mto_common_solution.type) AS "type",
    mto_solution.facilitated_by,
    mto_solution.needed_by,
    mto_solution.status,
    mto_solution.risk_indicator,
    mto_solution.poc_name,
    mto_solution.poc_email,
    mto_solution.created_by
FROM mto_solution
LEFT JOIN mto_common_solution ON mto_solution.mto_common_solution_key = mto_common_solution.key
WHERE
    mto_solution.model_plan_id = :model_plan_id
    AND mto_solution.mto_common_solution_key = :mto_common_solution_key
LIMIT 1;
