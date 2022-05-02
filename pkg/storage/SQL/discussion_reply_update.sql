UPDATE discussion_reply
SET discussion_id = :discussion_id,
    content = :content,
    resolution = :resolution,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING id,
    discussion_id,
    content,
    resolution,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
