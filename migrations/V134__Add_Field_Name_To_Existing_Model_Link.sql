-- Create the new type
CREATE TYPE EXISITING_MODEL_LINK_FIELD_TYPE AS ENUM {
  GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH
}

-- add the column to the table
ALTER TABLE existing_model_link
ADD COLUMN field_name EXISITING_MODEL_LINK_FIELD_TYPE;

-- Update existing data to point to the new column (this is the only field in use currently)
UPDATE existing_model_link
SET field_name = 'GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH',
      modified_by = '00000001-0001-0001-0001-000000000001',
      modified_dts = CURRENT_TIMESTAMP;


ALTER TABLE existing_model_link
ALTER COLUMN field_name SET NOT NULL;
