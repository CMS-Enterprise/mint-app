WITH QUERIED_IDS AS (
    SELECT UNNEST(CAST(:ticket_ids AS UUID[])) AS ticket_id
)

SELECT
    d.id,
    d.ticket_id,
    d.content,
    d.poster_role,
    d.created_by,
    d.created_dts
FROM ctat_discussion AS d
INNER JOIN QUERIED_IDS ON d.ticket_id = QUERIED_IDS.ticket_id
ORDER BY d.created_dts DESC;
