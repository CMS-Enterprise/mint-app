WITH source_links AS (
    SELECT 
        CAST(:milestone_id AS UUID) AS milestone_id,
        UNNEST(CAST(:solution_ids AS UUID[])) AS solution_id,
        CAST(:created_by AS UUID) AS created_by
),

inserted_links AS ( --noqa
    INSERT INTO mto_milestone_solution_link (milestone_id, solution_id, created_by)
    SELECT milestone_id, solution_id, created_by
    FROM source_links
    ON CONFLICT (milestone_id, solution_id) DO NOTHING
    RETURNING solution_id
),

deleted AS ( --noqa
    DELETE FROM mto_milestone_solution_link
    WHERE
        milestone_id = :milestone_id
        AND solution_id NOT IN (SELECT solution_id FROM source_links)
    RETURNING solution_id
)

SELECT
    s.id,
    s.model_plan_id,
    s.mto_common_solution_key,
    COALESCE(s.name, mto_common_solution.name) AS "name",
    COALESCE(s.type, mto_common_solution.type) AS "type",
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
JOIN source_links ON s.id = source_links.solution_id
LEFT JOIN mto_common_solution ON s.mto_common_solution_key = mto_common_solution.key
