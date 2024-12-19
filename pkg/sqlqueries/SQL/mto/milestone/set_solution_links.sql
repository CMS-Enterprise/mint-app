WITH
solutions AS (
    SELECT UNNEST(CAST(:solution_ids AS UUID[])) AS solution_id
),

common_sol_keys AS (
    SELECT UNNEST(CAST(:common_solution_keys AS MTO_COMMON_SOLUTION_KEY[])) AS mto_common_solution_key
),

model_plan_id AS (
    SELECT model_plan_id
    FROM mto_milestone
    WHERE id = :milestone_id
),

-- Insert stub solutions if needed
inserted_solutions AS (
    INSERT INTO mto_solution (
        id,
        model_plan_id,
        mto_common_solution_key,
        status,
        created_by
    )
    SELECT GEN_RANDOM_UUID(), (SELECT model_plan_id FROM model_plan_id), c.mto_common_solution_key, 'NOT_STARTED', :created_by
    FROM common_sol_keys c
    ON CONFLICT DO NOTHING
    RETURNING
        id
),

-- All relevant common solutions (existing or inserted)
relevant_common_solutions AS (
    SELECT id FROM inserted_solutions
    UNION ALL
    SELECT s.id
    FROM mto_solution s
    JOIN common_sol_keys c ON s.mto_common_solution_key = c.mto_common_solution_key
    WHERE s.model_plan_id = (SELECT model_plan_id FROM model_plan_id)
),

-- Final solutions is union of provided solution_ids and relevant common solutions
final_solutions AS (
    SELECT solution_id FROM solutions
    UNION
    SELECT id AS solution_id FROM relevant_common_solutions
),

-- Delete old links not in final_solutions
deleted AS (
    DELETE FROM mto_milestone_solution_link
    WHERE
        milestone_id = :milestone_id
        AND solution_id NOT IN (SELECT solution_id FROM final_solutions)
    RETURNING 1
),

-- Insert missing links
inserted_links AS (
    INSERT INTO mto_milestone_solution_link (milestone_id, solution_id, created_by)
    SELECT :milestone_id, solution_id, :created_by
    FROM final_solutions
    ON CONFLICT (milestone_id, solution_id) DO NOTHING
    RETURNING solution_id
)

SELECT
    s.id,
    s.model_plan_id,
    s.mto_common_solution_key,
    s.name,
    s.type,
    s.facilitated_by,
    s.needed_by,
    s.status,
    s.risk_indicator,
    s.poc_name,
    s.poc_email,
    s.created_by,
    s.created_dts,
    s.modified_by,
    s.modified_dts
FROM mto_solution s
JOIN mto_milestone_solution_link l ON l.solution_id = s.id
WHERE l.milestone_id = :milestone_id;
