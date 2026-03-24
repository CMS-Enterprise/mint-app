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

-- -- 8: drop the old key FK columns from child tables
ALTER TABLE mto_common_milestone_solution_link DROP COLUMN mto_common_milestone_key;
ALTER TABLE mto_suggested_milestone DROP COLUMN mto_common_milestone_key;
ALTER TABLE mto_template_milestone DROP COLUMN mto_common_milestone_key;

-- -- 9: mto_milestone.mto_common_milestone_key is referenced in the WHEN clause of the
-- -- sync_iddoc_on_milestone_* triggers (created in V254). Drop those triggers first,
-- -- then drop the column, then recreate the triggers using mto_common_milestone_id.
DROP TRIGGER IF EXISTS sync_iddoc_on_milestone_insert ON mto_milestone;
DROP TRIGGER IF EXISTS sync_iddoc_on_milestone_update ON mto_milestone;
DROP TRIGGER IF EXISTS sync_iddoc_on_milestone_delete ON mto_milestone;

ALTER TABLE mto_milestone DROP COLUMN mto_common_milestone_key;

-- Replace sync_iddoc_questionnaire_needed() with a version that uses mto_common_milestone_id
-- and identifies the IDDOC_SUPPORT library row by name (key column dropped below).
CREATE OR REPLACE FUNCTION sync_iddoc_questionnaire_needed()
RETURNS TRIGGER AS $$
DECLARE
    v_model_plan_id UUID;
    v_should_be_needed BOOLEAN;
    v_should_process BOOLEAN := FALSE;
BEGIN
    IF TG_TABLE_NAME = 'plan_ops_eval_and_learning' THEN
        v_model_plan_id := COALESCE(NEW.model_plan_id, OLD.model_plan_id);
        v_should_process := TRUE;
    ELSIF TG_TABLE_NAME = 'mto_solution' THEN
        v_model_plan_id := COALESCE(NEW.model_plan_id, OLD.model_plan_id);
        IF (TG_OP = 'DELETE' AND OLD.mto_common_solution_key IN ('INNOVATION', 'ACO_OS')) OR
           (TG_OP = 'INSERT' AND NEW.mto_common_solution_key IN ('INNOVATION', 'ACO_OS')) OR
           (TG_OP = 'UPDATE' AND (NEW.mto_common_solution_key IN ('INNOVATION', 'ACO_OS') OR
                                   OLD.mto_common_solution_key IN ('INNOVATION', 'ACO_OS'))) THEN
            v_should_process := TRUE;
        END IF;
    ELSIF TG_TABLE_NAME = 'mto_milestone' THEN
        v_model_plan_id := COALESCE(NEW.model_plan_id, OLD.model_plan_id);
        -- mto_milestone.mto_common_milestone_key was dropped; match the IDDOC_SUPPORT library row by name
        IF (TG_OP = 'DELETE' AND EXISTS(
                SELECT 1 FROM mto_common_milestone cm
                WHERE cm.id = OLD.mto_common_milestone_id AND cm.name = 'Establish 4i/ACO-OS support'
            )) OR
           (TG_OP = 'INSERT' AND EXISTS(
                SELECT 1 FROM mto_common_milestone cm
                WHERE cm.id = NEW.mto_common_milestone_id AND cm.name = 'Establish 4i/ACO-OS support'
            )) OR
           (TG_OP = 'UPDATE' AND (
                EXISTS(SELECT 1 FROM mto_common_milestone cm
                       WHERE cm.id = NEW.mto_common_milestone_id AND cm.name = 'Establish 4i/ACO-OS support') OR
                EXISTS(SELECT 1 FROM mto_common_milestone cm
                       WHERE cm.id = OLD.mto_common_milestone_id AND cm.name = 'Establish 4i/ACO-OS support')
           )) THEN
            v_should_process := TRUE;
        END IF;
    END IF;

    IF NOT v_should_process THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM plan_ops_eval_and_learning
        WHERE model_plan_id = v_model_plan_id
          AND iddoc_support = true

        UNION ALL

        SELECT 1
        FROM mto_solution
        WHERE model_plan_id = v_model_plan_id
          AND mto_common_solution_key IN ('INNOVATION', 'ACO_OS')

        UNION ALL

        SELECT 1
        FROM mto_milestone mm
        JOIN mto_common_milestone cm ON cm.id = mm.mto_common_milestone_id
        WHERE mm.model_plan_id = v_model_plan_id
          AND cm.name = 'Establish 4i/ACO-OS support'
    ) INTO v_should_be_needed;

    UPDATE iddoc_questionnaire
    SET
        needed       = v_should_be_needed,
        modified_by  = '00000001-0001-0001-0001-000000000001'::UUID,
        modified_dts = CURRENT_TIMESTAMP
    WHERE model_plan_id = v_model_plan_id
      AND needed != v_should_be_needed;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION sync_iddoc_questionnaire_needed() IS
'Automatically syncs the iddoc_questionnaire.needed field based on three business rules: '
'1) plan_ops_eval_and_learning.iddoc_support = true, '
'2) INNOVATION or ACO_OS solution exists, '
'3) IDDOC_SUPPORT milestone exists (matched by common milestone name). '
'Updated in V259/V261 to use mto_common_milestone_id (UUID FK) and name after key column removal.';

-- Drop legacy text key column from the library table (IDDOC sync uses name + UUID FK above)
ALTER TABLE mto_common_milestone DROP COLUMN key;

-- Recreate milestone triggers without WHEN clause (key column no longer exists on mto_milestone)
CREATE TRIGGER sync_iddoc_on_milestone_insert
AFTER INSERT ON mto_milestone
FOR EACH ROW
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

CREATE TRIGGER sync_iddoc_on_milestone_update
AFTER UPDATE OF mto_common_milestone_id
ON mto_milestone
FOR EACH ROW
WHEN (OLD.mto_common_milestone_id IS DISTINCT FROM NEW.mto_common_milestone_id)
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

CREATE TRIGGER sync_iddoc_on_milestone_delete
AFTER DELETE ON mto_milestone
FOR EACH ROW
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

COMMENT ON TRIGGER sync_iddoc_on_milestone_insert ON mto_milestone IS
'Triggers IDDOC questionnaire needed field sync when a milestone is inserted (updated in V259 to use mto_common_milestone_id)';

COMMENT ON TRIGGER sync_iddoc_on_milestone_update ON mto_milestone IS
'Triggers IDDOC questionnaire needed field sync when mto_common_milestone_id changes (updated in V259)';

COMMENT ON TRIGGER sync_iddoc_on_milestone_delete ON mto_milestone IS
'Triggers IDDOC questionnaire needed field sync when a milestone is deleted (updated in V259 to use mto_common_milestone_id)';
