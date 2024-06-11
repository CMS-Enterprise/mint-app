WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT user_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("user_id" UUID) --noqa
)

SELECT
    UNP.id,
    UNP.user_id,
    UNP.daily_digest_complete,
    UNP.added_as_collaborator,
    UNP.tagged_in_discussion,
    UNP.tagged_in_discussion_reply,
    UNP.new_discussion_reply,
    UNP.model_plan_shared,
    UNP.dates_changed,
    UNP.dates_changed_notification_type,
    UNP.created_by,
    UNP.created_dts,
    UNP.modified_by,
    UNP.modified_dts
FROM user_notification_preferences AS UNP
INNER JOIN QUERIED_IDS AS qIDs  ON UNP.user_id = qIDs.user_id;
