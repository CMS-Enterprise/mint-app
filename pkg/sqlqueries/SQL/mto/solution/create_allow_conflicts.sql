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
    RETURNING * -- "RETURNING *" is fine here since we have to manually select the columns from the CTE later in this query anyways
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
    id,
    model_plan_id,
    mto_common_solution_key,
    COALESCE(mto_solution.name, mto_solution.name) AS "name",
    COALESCE(mto_solution.type, mto_solution.type) AS "type",
    facilitated_by,
    needed_by,
    status,
    risk_indicator,
    poc_name,
    poc_email,
    created_by
FROM mto_solution
WHERE
    model_plan_id = :model_plan_id
    AND mto_common_solution_key = :mto_common_solution_key
LIMIT 1;
