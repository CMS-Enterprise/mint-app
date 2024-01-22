WITH links AS (
    /*Translate the input to a table */
    SELECT
        NULL AS existing_model_id,
        unnest(cast(:current_model_plan_ids AS UUID[])) AS current_model_plan_id

    UNION

    SELECT
        unnest(cast(:existing_model_ids AS INT[])) AS existing_model_id,
        NULL AS current_model_plan_id

),

existing_model_links AS (
    SELECT * FROM existing_model_link
    WHERE model_plan_id = :model_plan_id AND field_name = :field_name
),

/* Find the links that already exist */
matchedLinks AS ( 
    SELECT
        eml.model_plan_id,
        links.existing_model_id,
        links.current_model_plan_id,
        CASE
            WHEN (eml.model_plan_id IS NOT NULL OR cml.model_plan_id IS NOT NULL) THEN TRUE --noqa
            ELSE FALSE
        END AS dontInsert
    FROM links
    LEFT JOIN existing_model_link AS cml ON ( cml.model_plan_id = :model_plan_id AND cml.field_name = :field_name AND links.current_model_plan_id = cml.current_model_plan_id)
    LEFT JOIN existing_model_link AS eml ON ( eml.model_plan_id = :model_plan_id AND eml.field_name = :field_name AND links.existing_model_id = eml.existing_model_id)
),
/* Find the links not matched by source (EG ok to delete) */

existingToDelete AS (
    SELECT 
        EML.id,
        CASE
            WHEN (exml.existing_model_id IS NULL AND cml.current_model_plan_id IS NULL) THEN TRUE --noqa
            ELSE FALSE
        END AS toDelete
    FROM existing_model_links AS EML
    LEFT JOIN links AS cml ON EML.current_model_plan_id = cml.current_model_plan_id
    LEFT JOIN links AS exml ON  EML.existing_model_id = exml.existing_model_id

),

/* insert new records as needed */
inserted AS (
    INSERT INTO existing_model_link(id, model_plan_id, field_name, existing_model_id, current_model_plan_id, created_by)
    SELECT
        gen_random_uuid() AS id, --Use the actual id, not gen random id here
        :model_plan_id AS model_plan_id,
        :field_name AS field_name,
        matchedLinks.existing_model_id,
        matchedLinks.current_model_plan_id,
        :created_by AS created_by
    FROM matchedLinks
    WHERE
        matchedLinks.dontInsert = FALSE
RETURNING
id,
model_plan_id,
existing_model_id,
current_model_plan_id,
field_name,
created_by,
created_dts,
modified_by,
modified_dts
),

/* deleteRows identified earlier */
deletedRows AS (
    DELETE FROM
    existing_model_link
    WHERE existing_model_link.id IN ( SELECT existingToDelete.ID FROM existingToDelete WHERE existingToDelete.toDelete = TRUE)
    RETURNING
    id,
    model_plan_id,
    existing_model_id,
    current_model_plan_id,
    field_name,
    created_by,
    created_dts,
    modified_by,
    modified_dts
)
/* return all inserted and existing links */

SELECT 
    eml.id,
    eml.model_plan_id,
    eml.existing_model_id,
    eml.current_model_plan_id,
    eml.field_name,
    eml.created_by,
    eml.created_dts,
    eml.modified_by,
    eml.modified_dts
FROM existing_model_link AS eml
WHERE
    eml.model_plan_id = :model_plan_id
    AND eml.id NOT IN (SELECT ID FROM deletedRows)
UNION 
SELECT
    inserted.id,
    inserted.model_plan_id,
    inserted.existing_model_id,
    inserted.current_model_plan_id,
    inserted.field_name,
    inserted.created_by,
    inserted.created_dts,
    inserted.modified_by,
    inserted.modified_dts
FROM inserted
