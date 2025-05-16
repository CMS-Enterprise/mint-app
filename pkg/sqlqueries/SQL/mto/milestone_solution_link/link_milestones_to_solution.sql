WITH source_links AS (
    SELECT
        CAST(:solution_id AS UUID) AS solution_id,
        UNNEST(CAST(:milestone_ids AS UUID[])) AS milestone_id,
        CAST(:created_by AS UUID) AS created_by
),

     inserted_links AS ( --noqa
    INSERT INTO mto_milestone_solution_link (solution_id, milestone_id, created_by)
    SELECT solution_id, milestone_id, created_by
    FROM source_links
    ON CONFLICT (solution_id, milestone_id) DO NOTHING
    RETURNING milestone_id
),

     deleted AS ( --noqa
    DELETE FROM mto_milestone_solution_link
    WHERE
        solution_id = :solution_id
        AND milestone_id NOT IN (SELECT milestone_id FROM source_links)
    RETURNING milestone_id
)

SELECT
    m.id,
    m.model_plan_id,
    m.mto_common_milestone_key,
    m.mto_category_id,
    COALESCE(m.name, mto_common_milestone.name) AS "name",
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
LEFT JOIN mto_common_milestone ON m.mto_common_milestone_key = mto_common_milestone.key
JOIN source_links ON m.id = source_links.milestone_id;
