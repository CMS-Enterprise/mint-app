WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("id" int) --noqa
)

SELECT
    eM.id,
    eM.model_name,
    eM.stage,
    eM.number_of_participants,
    eM.category,
    eM.authority,
    eM.description,
    eM.number_of_beneficiaries_impacted,
    eM.number_of_physicians_impacted,
    eM.date_began,
    eM.date_ended,
    eM.states,
    eM.keywords,
    eM.url,
    eM.display_model_summary,
    eM.created_by,
    eM.created_dts,
    eM.modified_by,
    eM.modified_dts

FROM QUERIED_IDS AS qIDs
INNER JOIN existing_model AS eM ON eM.id = qIDs.id;
