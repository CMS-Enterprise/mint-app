CREATE TABLE IF NOT EXISTS ctat_discussion (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    ticket_id UUID NOT NULL REFERENCES ctat_request(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    poster_role CTAT_DISCUSSION_POSTER_ROLE NOT NULL,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

-- index by ticket for bulk retrievals by ticket id
CREATE INDEX IF NOT EXISTS idx_ctat_discussion_ticket_id
ON ctat_discussion (ticket_id);

-- Record discussion writes under their parent CTAT ticket.
SELECT audit.AUDIT_TABLE(
    'public',
    'ctat_discussion',
    'id',
    'ticket_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,ticket_id}'::TEXT[]
);
