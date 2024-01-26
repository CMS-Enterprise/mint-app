-- Create the new type
CREATE TYPE EXISITING_MODEL_LINK_FIELD_TYPE AS ENUM (
  'GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH',
  'GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH'
);

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

/* Update Audit table to insert the field when link is created*/ 
UPDATE audit.table_config
SET
insert_fields = '{existing_model_id,current_model_plan_id,field_name}',
modified_by = '00000001-0001-0001-0001-000000000001', --system_account
modified_dts = CURRENT_TIMESTAMP
WHERE name = 'existing_model_link';




ALTER TABLE existing_model_link
DROP CONSTRAINT unique_existing_model_link_existing;

/* Add constraint requiring that you can only link a model and existing model once per field*/
ALTER TABLE existing_model_link
ADD CONSTRAINT unique_existing_model_link_existing_field_name UNIQUE (model_plan_id, existing_model_id, field_name);
COMMENT ON CONSTRAINT unique_existing_model_link_existing_field_name ON existing_model_link IS 'This constraint requires that there is not a duplicate link per model_plan, existing model, and field name';


ALTER TABLE existing_model_link
DROP CONSTRAINT unique_existing_model_link_current_model;
/* Add constraint requiring that you can only link a model and current model once per field*/
ALTER TABLE existing_model_link
ADD CONSTRAINT unique_existing_model_link_current_model_field_name UNIQUE (model_plan_id, current_model_plan_id, field_name);
COMMENT ON CONSTRAINT unique_existing_model_link_current_model_field_name ON existing_model_link IS 'This constraint requires that there is not a duplicate link per model_plan, current_model, and field name';
