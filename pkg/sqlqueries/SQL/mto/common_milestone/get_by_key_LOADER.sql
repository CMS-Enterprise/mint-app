WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:keys AS MTO_COMMON_MILESTONE_KEY[]))  AS "key"
)

SELECT
    mto_common_milestone.name,
    mto_common_milestone.key,
    mto_common_milestone.category_name,
    mto_common_milestone.sub_category_name,
    mto_common_milestone.description,
    mto_common_milestone.facilitated_by_role,
    FALSE AS is_added
FROM mto_common_milestone
INNER JOIN QUERIED_IDS AS qIDs ON mto_common_milestone.key = qIDs.key
