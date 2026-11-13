INSERT INTO ctat_discussion (
    ticket_id, 
    content, 
    poster_role, 
    created_by,
    created_dts
)
VALUES (
    :ticket_id,
    :content,
    :poster_role, 
    :created_by,
    COALESCE(:created_dts, CURRENT_TIMESTAMP) -- for data seeding purposes
)
RETURNING
    id,
    ticket_id,
    content,
    poster_role,
    created_by,
    created_dts;
