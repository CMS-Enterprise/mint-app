WITH source_links AS (
    SELECT 
        :milestone_id AS milestone_id,
        UNNEST(CAST(:solution_ids AS UUID[])) AS solution_id,
        :created_by AS created_by
),

MERGED_RESULT AS (
MERGE INTO mto_milestone_solution_link AS target
USING source_links AS source
ON target.solution_id = source.solution_id
AND target.milestone_id = source.milestone_id
WHEN MATCHED THEN 
    DO NOTHING
-- delete all other source_links for that milestone 
WHEN NOT MATCHED BY SOURCE AND target.milestone_id = :milestone_id THEN
    DELETE
-- insert records that are not
WHEN NOT MATCHED BY TARGET THEN
    INSERT (milestone_id, solution_id, created_by)
    VALUES (source.milestone_id, source.solution_id, source.created_by)
),

LINKS AS (
    SELECT
        links.id,
        links.milestone_id,
        links.solution_id,
        links.created_by,
        links.created_dts,
        links.modified_by,
        links.modified_dts
    FROM mto_milestone_solution_link AS links
    JOIN source_links ON source_links.milestone_id = links.id AND source_links.solution_id = links.solution_id
)
-- TODO, should we instead return solutions that are linked? Probably so

SELECT * FROM LINKS
