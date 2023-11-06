CREATE TYPE TAG_TYPE AS ENUM (
  'USER_ACCOUNT',
  'POSSIBLE_SOLUTION'
);


CREATE TABLE tag ( -- Should this name be different / longer?
    id UUID PRIMARY KEY NOT NULL,
    tag_type TAG_TYPE NOT NULL, --For identifying which table to  get the tagged entity from
    tagged_field ZERO_STRING NOT NULL,  -- this allows us to potentially tag different fields on the same table
    
    tagged_content_id UUID NOT NULL, --The foreign key of the record that contains the tag
    tagged_content_table ZERO_STRING NOT NULL, -- table_id integer REFERENCES audit.table_config(id), //TODO: note, we could choose to use the table_config table to generically return tagged content. (possible solutiosn aren't there.) For now, just a type
    entity_uuid UUID,
    entity_intid int,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_dts timestamp with time zone,
    created_by uuid NOT NULL REFERENCES user_account(id),
    modified_by uuid REFERENCES user_account(id)
);


ALTER TABLE tag
ADD CONSTRAINT entity_uuid_or_intid_required CHECK ( (entity_uuid IS NOT NULL AND entity_intid IS NULL) OR (entity_uuid IS NULL AND entity_intid IS NOT NULL));


COMMENT ON CONSTRAINT entity_uuid_or_intid_required IS 'Ensures that either entity_uuid or entity_intid is set, but not both (or neither)'
