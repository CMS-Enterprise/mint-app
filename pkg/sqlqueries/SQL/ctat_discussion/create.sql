INSERT INTO ctat_discussion (
    ticket_id, 
    content, 
    poster_role, 
    created_by
)
VALUES (
    :ticket_id,
    :content,
    :poster_role, 
    :created_by
)
RETURNING
    id,
    ticket_id,
    content,
    poster_role,
    created_by,
    created_dts;
