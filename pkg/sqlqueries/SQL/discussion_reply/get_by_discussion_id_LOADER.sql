WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT discussion_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("discussion_id" UUID) --noqa
)

SELECT
    discR.id,
    discR.discussion_id,
    discR.content,
    discR.user_role,
    discR.user_role_description,
    discR.is_assessment,
    discR.created_by,
    discR.created_dts,
    discR.modified_by,
    discR.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN discussion_reply AS discR ON discR.discussion_id = qIDs.discussion_id
ORDER BY discR.created_dts ASC;
