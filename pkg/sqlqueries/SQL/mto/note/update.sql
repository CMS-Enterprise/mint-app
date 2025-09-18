UPDATE mto_milestone_note
SET
    content = :content,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id;
