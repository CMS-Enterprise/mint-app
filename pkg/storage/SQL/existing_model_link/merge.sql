WITH links AS (
    /*Translate the input to a table */
    SELECT
		NULL AS existing_model_id,
		unnest(cast(:current_model_plan_ids AS UUID[])) AS current_model_plan_id
	UNION SELECT
		unnest(cast(:existing_model_ids AS int[])) AS existing_model_id,
		NULL AS current_model_plan_id

),
existing_model_links AS (
	SELECT * FROM existing_model_link
	WHERE model_plan_id = :model_plan_id
),

/* Find the links that already exist */
matchedLinks AS ( 
	SELECT
	eml.model_plan_id,
	links.existing_model_id,
	links.current_model_plan_id,
	CASE
	WHEN (eml.model_plan_id IS NOT NULL OR cml.model_plan_id IS NOT NULL) THEN TRUE
	ELSE FALSE
	END AS dontInsert
	FROM links
	LEFT JOIN existing_model_link AS cml ON ( cml.model_plan_id = :model_plan_id AND links.current_model_plan_id = cml.current_model_plan_id)
	LEFT JOIN existing_model_link AS eml ON ( eml.model_plan_id = :model_plan_id AND links.existing_model_id = eml.existing_model_id)
),
/* Find the links not matched by source (EG ok to delete) */
existingToDelete AS (
SELECT eml.id,
	CASE
	-- WHEN matchedLinks.model_plan_id IS NULL THEN TRUE
	WHEN (exml.existing_model_id IS NULL AND cml.current_model_plan_id IS NULL) THEN TRUE --if both are null
	ELSE FALSE
	END AS toDelete
 FROM existing_model_links AS EML
 	LEFT JOIN links AS cml ON EML.current_model_plan_id = cml.current_model_plan_id
	LEFT JOIN links AS exml ON  EML.existing_model_id = exml.existing_model_id

),	
/* insert new records as needed */
inserted AS (
	INSERT INTO existing_model_link(id, model_plan_id, existing_model_id, current_model_plan_id, created_by)
SELECT
    GEN_RANDOM_UUID() AS id, --Use the actual id, not gen random id here
    :model_plan_id AS model_plan_id,
    matchedLinks.existing_model_id,
    matchedLinks.current_model_plan_id,
    :created_by AS created_by
FROM matchedLinks
	WHERE
	dontInsert = FALSE
RETURNING
id,
model_plan_id,
existing_model_id,
current_model_plan_id,
created_by,
created_dts,
modified_by,
modified_dts
	),

/* deleteRows identified earlier */
deletedRows AS (
	DELETE fROM
	existing_model_link
	WHERE existing_model_link.id IN ( SELECT existingToDelete.ID FROM existingToDelete WHERE existingToDelete.toDelete = TRUE)
RETURNING
	id,
	model_plan_id,
	existing_model_id,
	current_model_plan_id,
	created_by,
	created_dts,
	modified_by,
	modified_dts
	)
/* return all links */

/* TODO This doesn't work in the same transaction... we need to either return the existing, and potentional do a union all with the inserted rows?*/ 
SELECT 
eml.id,
eml.model_plan_id,
eml.existing_model_id,
eml.current_model_plan_id,
eml.created_by,
eml.created_dts,
eml.modified_by,
eml.modified_dts
FROM existing_model_link AS eml
	WHERE eml.model_plan_id = :model_plan_id
	AND eml.id NOT IN (SELECT ID from deletedRows)
UNION 
	SELECT
	inserted.id,
	inserted.model_plan_id,
	inserted.existing_model_id,
	inserted.current_model_plan_id,
	inserted.created_by,
	inserted.created_dts,
	inserted.modified_by,
	inserted.modified_dts
	FROM inserted

