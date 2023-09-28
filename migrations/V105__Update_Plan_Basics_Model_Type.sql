-- ALTER TABLE plan_basics

  --     model_type MODEL_TYPE,

  /*
  1. Modify the types to add the new types
    a. TBD is currently not exposed in the front end
    b. Maybe change that to unkown?
    c. Mandatory is now regional or national
  2. Update the field to be multi-select
  3. Handle the data migration for anything that was previously set to mandatory




  */

ALTER TYPE MODEL_TYPE RENAME VALUE 'TBD' TO 'UNKNOWN';
ALTER TYPE MODEL_TYPE RENAME VALUE 'MANDATORY' TO 'MANDATORY_REGIONAL'; -- TODO: SW verify if any are changed by this, PROD data should be updated
ALTER TYPE MODEL_TYPE ADD VALUE 'MANDATORY_NATIONAL' AFTER 'MANDATORY_REGIONAL';
ALTER TYPE MODEL_TYPE ADD VALUE 'NONE' AFTER 'UNKNOWN';
ALTER TYPE MODEL_TYPE ADD VALUE 'OTHER' AFTER 'NONE';

ALTER TABLE plan_basics 
  ALTER COLUMN model_type TYPE MODEL_TYPE[] USING CASE WHEN model_type IS NULL THEN NULL ELSE array[model_type] END,
  ADD COLUMN model_type_other zero_string;
