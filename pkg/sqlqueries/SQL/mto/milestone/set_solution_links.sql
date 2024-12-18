WITH
-- Convert provided solution_ids to rows
solutions AS (
    SELECT UNNEST(CAST(:solution_ids AS UUID[])) AS solution_id
),

-- Convert provided common solution keys to rows
common_sol_keys AS (
    SELECT UNNEST(CAST(:common_solution_keys AS MTO_COMMON_SOLUTION_KEY[])) AS mto_common_solution_key
),

-- Extract model_plan_id from the milestone
model_plan_id AS (
    SELECT model_plan_id FROM mto_milestone WHERE id = :milestone_id
),

-- Attempt to insert stub solutions for each common solution key if they don't exist
inserted_solutions AS (
    INSERT INTO mto_solution (
        id,
        model_plan_id,
        mto_common_solution_key,
        status,
        created_by
    )
    SELECT GEN_RANDOM_UUID(), mp.model_plan_id, c.mto_common_solution_key, 'NOT_STARTED', :created_by
    FROM common_sol_keys c
    CROSS JOIN model_plan_id mp
    ON CONFLICT DO NOTHING
    RETURNING
        id, model_plan_id, mto_common_solution_key,
        name, type, facilitated_by, needed_by,
        status, risk_indicator, poc_name, poc_email, created_by
),

-- Get existing solutions for these common keys and coalesce their fields with mto_common_solution
existing_solutions AS (
    SELECT
        s.id,
        s.model_plan_id,
        s.mto_common_solution_key,
        COALESCE(s.name, cs.name) AS name,
        COALESCE(s.type, cs.type) AS type,
        s.facilitated_by,
        s.needed_by,
        s.status,
        s.risk_indicator,
        s.poc_name,
        s.poc_email,
        s.created_by
    FROM mto_solution s
    JOIN common_sol_keys c ON s.mto_common_solution_key = c.mto_common_solution_key
    LEFT JOIN mto_common_solution cs ON s.mto_common_solution_key = cs.key
),

-- Combine inserted and existing common solutions into one set
all_common_solutions AS (
    SELECT * FROM inserted_solutions
    UNION ALL
    SELECT * FROM existing_solutions
),

-- Final set of solution_ids includes both the provided solution_ids and the IDs from common solutions
final_solutions AS (
    SELECT solution_id FROM solutions
    UNION ALL
    SELECT id AS solution_id FROM all_common_solutions
),

-- Remove any solution links not in final_solutions
deleted AS (
    DELETE FROM mto_milestone_solution_link
    WHERE
        milestone_id = :milestone_id
        AND solution_id NOT IN (SELECT solution_id FROM final_solutions)
    RETURNING *
),

-- Upsert new links from final_solutions
upserted AS (
    INSERT INTO mto_milestone_solution_link (milestone_id, solution_id, created_by)
    SELECT :milestone_id, solution_id, :created_by
    FROM final_solutions
    ON CONFLICT (milestone_id, solution_id) DO NOTHING
    RETURNING milestone_id
)

-- Return the full milestone after updates
SELECT
    m.id,
    m.model_plan_id,
    m.mto_common_milestone_key,
    m.name,
    m.mto_category_id,
    m.facilitated_by,
    m.need_by,
    m.status,
    m.risk_indicator,
    m.is_draft,
    m.created_by,
    m.created_dts,
    m.modified_by,
    m.modified_dts
FROM mto_milestone m
WHERE m.id = :milestone_id;
