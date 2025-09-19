WITH QUERIED_ID AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:id AS UUID[]))  AS id
)

SELECT
    mto_milestone_note.id,
    mto_milestone_note.mto_milestone_id,
    mto_milestone_note.content,
    mto_milestone_note.created_by,
    mto_milestone_note.created_dts,
    mto_milestone_note.modified_by,
    mto_milestone_note.modified_dts
FROM mto_milestone_note
INNER JOIN QUERIED_ID AS qID ON mto_milestone_note.id = qID.id
