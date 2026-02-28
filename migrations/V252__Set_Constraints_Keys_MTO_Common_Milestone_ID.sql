
-- -- re-enable triggers
ALTER TABLE mto_milestone
ENABLE TRIGGER audit_trigger;

ALTER TABLE mto_template_milestone
ENABLE TRIGGER audit_trigger;

-- -- 3: set the non-null constraints on the new columns on the child tables
ALTER TABLE mto_common_milestone_solution_link
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

ALTER TABLE mto_suggested_milestone
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

ALTER TABLE mto_template_milestone
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

-- update ALL FK relationships before swapping primary key columns
-- -- 4: drop the old FK relationships--
ALTER TABLE mto_common_milestone_solution_link
DROP CONSTRAINT mto_common_milestone_solution_lin_mto_common_milestone_key_fkey;

ALTER TABLE mto_milestone
DROP CONSTRAINT mto_milestone_mto_common_milestone_key_fkey;

ALTER TABLE mto_suggested_milestone
DROP CONSTRAINT mto_suggested_milestone_mto_common_milestone_key_fkey;

ALTER TABLE mto_template_milestone
DROP CONSTRAINT mto_template_milestone_mto_common_milestone_key_fkey;

-- -- 5: create the new FK relationships
ALTER TABLE mto_common_milestone_solution_link
ADD CONSTRAINT mto_common_milestone_solution_link_mto_common_milestone_id_fkey
FOREIGN KEY (mto_common_milestone_id) REFERENCES mto_common_milestone (id);

ALTER TABLE mto_milestone
ADD CONSTRAINT mto_milestone_mto_common_milestone_id_fkey
FOREIGN KEY (mto_common_milestone_id) REFERENCES mto_common_milestone (id);

ALTER TABLE mto_suggested_milestone
ADD CONSTRAINT mto_suggested_milestone_mto_common_milestone_id_fkey
FOREIGN KEY (mto_common_milestone_id) REFERENCES mto_common_milestone (id);

ALTER TABLE mto_template_milestone
ADD CONSTRAINT mto_template_milestone_mto_common_milestone_id_fkey
FOREIGN KEY (mto_common_milestone_id) REFERENCES mto_common_milestone (id);

-- -- 6: swap primary key columns
ALTER TABLE mto_common_milestone
DROP CONSTRAINT mto_common_milestone_pkey,
ADD PRIMARY KEY (id);

ALTER TABLE mto_common_milestone_solution_link
DROP CONSTRAINT mto_common_milestone_solution_link_pkey,
ADD PRIMARY KEY (mto_common_milestone_id,mto_common_solution_key);

ALTER TABLE mto_milestone
DROP CONSTRAINT IF EXISTS unique_mto_common_milestone_per_model_plan;

ALTER TABLE mto_milestone
ADD CONSTRAINT unique_mto_common_milestone_per_model_plan UNIQUE (model_plan_id, mto_common_milestone_id);
COMMENT ON CONSTRAINT unique_mto_common_milestone_per_model_plan ON mto_milestone IS 'Constraint to ensure that each common milestone can be linked to a model plan only once';

ALTER TABLE mto_milestone
DROP CONSTRAINT IF EXISTS check_name_or_common_milestone_null;

ALTER TABLE mto_milestone
ADD CONSTRAINT check_name_or_common_milestone_null CHECK (
    (mto_common_milestone_id IS NULL OR name IS NULL)
    AND NOT (mto_common_milestone_id IS NULL AND name IS NULL)
);
COMMENT ON CONSTRAINT check_name_or_common_milestone_null ON mto_milestone IS 
'Ensures either mto_common_milestone_id or name is null, but not both: if a common milestone is referenced, name must be null; if name is specified, no common milestone may be referenced.';

DROP INDEX IF EXISTS unique_name_per_model_plan_when_mto_common_milestone_is_null;
CREATE UNIQUE INDEX unique_name_per_model_plan_when_mto_common_milestone_is_null
ON mto_milestone (model_plan_id, name)
WHERE mto_common_milestone_id IS NULL;
COMMENT ON INDEX unique_name_per_model_plan_when_mto_common_milestone_is_null IS 'Unique index to enforce that milestone names are unique per model plan when no common milestone is associated';

DROP INDEX IF EXISTS uniq_template_common_milestone;
CREATE UNIQUE INDEX uniq_template_common_milestone
ON mto_template_milestone (template_id, mto_common_milestone_id);
COMMENT ON INDEX uniq_template_common_milestone IS 'Constraint to ensure that each common milestone can be linked to a template only once';

-- -- 7: Add audit configuration for the mto_common_milestone table
SELECT audit.AUDIT_TABLE(
    'public',
    'mto_common_milestone',
    'id',
    'model_plan_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*}'::TEXT[]
);
