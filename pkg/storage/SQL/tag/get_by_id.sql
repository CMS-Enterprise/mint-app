SELECT
    id,
    tag_type,
    tagged_content_id,
    entity_uuid,
    entity_intid,
    created_dts,
    modified_dts,
    created_by,
    modified_by
FROM public.tag
WHERE id = :id;
