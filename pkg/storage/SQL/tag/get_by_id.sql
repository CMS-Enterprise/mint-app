SELECT
    id,
    tag_type,
    tagged_field,
    tagged_content_table,
    tagged_content_id,
    entity_uuid,
    entity_intid,
    created_dts,
    modified_dts,
    created_by,
    modified_by
FROM public.tag
WHERE id = :id;
