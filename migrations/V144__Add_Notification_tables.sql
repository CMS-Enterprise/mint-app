-- Create the new type
CREATE TYPE EVENT_TYPE AS ENUM (
  'DAILY_DIGEST_COMPLETE',
  'NEW_PLAN_DISCUSSION',
  'NEW_DISCUSSION_REPLY'
);

CREATE TABLE publication ( --TODO settle on naming. The word event is reserved
    id UUID PRIMARY KEY NOT NULL,
    actor UUID NOT NULL REFERENCES user_account(id), --foreign key to user table
    event_type EVENT_TYPE NOT NULL,

    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id), --Who wrote this row, not necessarily the actor, though it could be the same
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE

);

--NOTE these tables likely doesn't need to be audited. It is an audit table by itself. If we want, we can audit it though

CREATE TABLE notification ( --TODO settle on naming. The word notification is reserved
    id UUID PRIMARY KEY NOT NULL,
    publication_id UUID NOT NULL REFERENCES publication(id), --foreign key to user table
    user_id UUID NOT NULL REFERENCES user_account(id),
    is_read  BOOLEAN NOT NULL DEFAULT FALSE,


    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id), --Who wrote this row, not necessarily the actor, though it could be the same
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE

);
