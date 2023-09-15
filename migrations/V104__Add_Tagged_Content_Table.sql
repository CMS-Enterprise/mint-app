CREATE TYPE TAG_TYPE AS ENUM (
  'USER_ACCOUNT',
  'POSSIBLE_SOLUTION'
);


CREATE TABLE tag ( -- Should this name be different / longer?
    id UUID PRIMARY KEY NOT NULL,
    tag_type TAG_TYPE NOT NULL,
    -- table_id integer REFERENCES audit.table_config(id), //TODO: note, we could choose to use the table_config table to generically return tagged content. (possible solutiosn aren't there.) For now, just a type
    tagged_content_id UUID NOT NULL,
    entity_uuid UUID,
    entity_intid int,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_dts timestamp with time zone,
    created_by uuid NOT NULL REFERENCES user_account(id),
    modified_by uuid REFERENCES user_account(id)
);

-- ALTER TABLE tag
-- ADD CONSTRAINT unique_tage UNIQUE (enti);
/*
1. Constrain that only the 


*/
