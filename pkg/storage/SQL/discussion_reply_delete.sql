DELETE FROM discussion_reply
WHERE id = :id
RETURNING id,
    discussion_id,
    content,
    resolution,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
    
