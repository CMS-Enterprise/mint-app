WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:milestone_ids AS UUID[])) AS milestone_id
)

SELECT
    mto_milestone_note.id,
    mto_milestone_note.milestone_id,
    mto_milestone_note.content,
    mto_milestone_note.created_by,
    mto_milestone_note.created_dts,
    mto_milestone_note.modified_by,
    mto_milestone_note.modified_dts
FROM mto_milestone_note
INNER JOIN QUERIED_IDS AS qIDs ON mto_milestone_note.milestone_id = qIDs.milestone_id
ORDER BY mto_milestone_note.milestone_id, mto_milestone_note.created_dts DESC;
