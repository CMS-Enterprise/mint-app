WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT 
        id,
        "tagType" AS "tag_type",
        "taggedField" AS "tagged_field",
        "taggedContentTable" AS "tagged_content_table",
        "taggedContentID" AS "tagged_content_id",
        "entityUUID" AS "entity_uuid",
        "entityIntID" AS "entity_intid",
        "createdBy" AS "created_by",
        "modifiedBy" AS "modified_by"
    FROM JSON_TO_RECORDSET(:paramTableJSON) AS x( "id" UUID, "tagType" TAG_TYPE, "taggedField" ZERO_STRING, "taggedContentID" UUID, "taggedContentTable" ZERO_STRING, "entityUUID" UUID, "entityIntID" int, "createdDts" timestamp, "modified_dts" timestamp, "createdBy" uuid, "modifiedBy" uuid) --noqa
)

INSERT INTO public.tag(
    id,
    tag_type,
    tagged_field,
    tagged_content_table,
    tagged_content_id,
    entity_uuid,
    entity_intid,
    created_by,
    modified_by
)
SELECT 
    id,
    tag_type,
    tagged_field,
    tagged_content_table,
    tagged_content_id,
    entity_uuid,
    entity_intid,
    created_by,
    modified_by
FROM QUERIED_IDS
RETURNING id,
    tag_type,
    tagged_field,
    tagged_content_table,
    tagged_content_id,
    entity_uuid,
    entity_intid,
    created_dts,
    modified_dts,
    created_by,
    modified_by;
