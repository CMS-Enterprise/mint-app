WITH QUERIED_IDs AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[]))  AS id
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
INNER JOIN QUERIED_IDs AS qID ON mto_milestone_note.id = qID.id
