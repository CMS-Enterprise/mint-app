WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[])) AS id
)

SELECT
    r.id,
    r.mto_suggested_milestone_id,
    r.trigger_table,
    r.trigger_col,
    r.trigger_val,
    r.created_by,
    r.created_dts,
    r.modified_by,
    r.modified_dts
FROM mto_suggested_milestone_reason r
INNER JOIN QUERIED_IDS ON r.mto_suggested_milestone_id = QUERIED_IDS.id
ORDER BY r.trigger_table, r.trigger_col, r.trigger_val;
