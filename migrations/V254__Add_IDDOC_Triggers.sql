-- Create a function to sync the IDDOC questionnaire needed field based on trigger conditions
-- The trigger function no longer manages status transitions - it only sets needed=true/false
-- Status is now orthogonal to needed and is managed separately by the application
CREATE OR REPLACE FUNCTION sync_iddoc_questionnaire_needed()
RETURNS TRIGGER AS $$
DECLARE
    v_model_plan_id UUID;
    v_should_be_needed BOOLEAN;
    v_should_process BOOLEAN := FALSE;
BEGIN
    -- Determine the model_plan_id and check if we should process this trigger
    IF TG_TABLE_NAME = 'plan_ops_eval_and_learning' THEN
        v_model_plan_id := COALESCE(NEW.model_plan_id, OLD.model_plan_id);
        v_should_process := TRUE;
    ELSIF TG_TABLE_NAME = 'mto_solution' THEN
        v_model_plan_id := COALESCE(NEW.model_plan_id, OLD.model_plan_id);
        -- Only process if the solution is INNOVATION or ACO_OS
        IF (TG_OP = 'DELETE' AND OLD.mto_common_solution_key IN ('INNOVATION', 'ACO_OS')) OR
           (TG_OP = 'INSERT' AND NEW.mto_common_solution_key IN ('INNOVATION', 'ACO_OS')) OR
           (TG_OP = 'UPDATE' AND (NEW.mto_common_solution_key IN ('INNOVATION', 'ACO_OS') OR
                                   OLD.mto_common_solution_key IN ('INNOVATION', 'ACO_OS'))) THEN
            v_should_process := TRUE;
        END IF;
    ELSIF TG_TABLE_NAME = 'mto_milestone' THEN
        v_model_plan_id := COALESCE(NEW.model_plan_id, OLD.model_plan_id);
        -- Only process if the milestone is IDDOC_SUPPORT
        IF (TG_OP = 'DELETE' AND OLD.mto_common_milestone_key = 'IDDOC_SUPPORT') OR
           (TG_OP = 'INSERT' AND NEW.mto_common_milestone_key = 'IDDOC_SUPPORT') OR
           (TG_OP = 'UPDATE' AND (NEW.mto_common_milestone_key = 'IDDOC_SUPPORT' OR
                                   OLD.mto_common_milestone_key = 'IDDOC_SUPPORT')) THEN
            v_should_process := TRUE;
        END IF;
    END IF;

    -- Exit early if we shouldn't process this trigger
    IF NOT v_should_process THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- Check if any of the three trigger conditions are met
    SELECT EXISTS (
        -- Condition 1: OEL iddoc_support = true
        SELECT 1
        FROM plan_ops_eval_and_learning
        WHERE model_plan_id = v_model_plan_id
          AND iddoc_support = true

        UNION ALL

        -- Condition 2: INNOVATION or ACO_OS solution selected
        SELECT 1
        FROM mto_solution
        WHERE model_plan_id = v_model_plan_id
          AND mto_common_solution_key IN ('INNOVATION', 'ACO_OS')

        UNION ALL

        -- Condition 3: IDDOC_SUPPORT milestone selected
        SELECT 1
        FROM mto_milestone
        WHERE model_plan_id = v_model_plan_id
          AND mto_common_milestone_key = 'IDDOC_SUPPORT'
    ) INTO v_should_be_needed;

    -- Update the needed field. modified_by is set to the system account to satisfy the
    -- audit trigger's NOT NULL constraint on audit.change.modified_by. The application
    -- checks for the system account UUID to distinguish system-driven updates from real
    -- user edits when inferring task list status.
    UPDATE iddoc_questionnaire
    SET
        needed = v_should_be_needed,
        modified_by = '00000001-0001-0001-0001-000000000001'::UUID, -- MINT System Account
        modified_dts = CURRENT_TIMESTAMP
    WHERE model_plan_id = v_model_plan_id
      AND needed != v_should_be_needed;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add trigger to plan_ops_eval_and_learning for iddoc_support changes
CREATE TRIGGER sync_iddoc_on_oel_update
AFTER UPDATE OF iddoc_support
ON plan_ops_eval_and_learning
FOR EACH ROW
WHEN (OLD.iddoc_support IS DISTINCT FROM NEW.iddoc_support)
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

-- Add trigger to mto_solution for INNOVATION/ACO_OS changes
CREATE TRIGGER sync_iddoc_on_solution_insert
AFTER INSERT
ON mto_solution
FOR EACH ROW
WHEN (NEW.mto_common_solution_key IN ('INNOVATION', 'ACO_OS'))
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

CREATE TRIGGER sync_iddoc_on_solution_update
AFTER UPDATE OF mto_common_solution_key
ON mto_solution
FOR EACH ROW
WHEN (
    (NEW.mto_common_solution_key IN ('INNOVATION', 'ACO_OS')) OR
    (OLD.mto_common_solution_key IN ('INNOVATION', 'ACO_OS'))
)
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

CREATE TRIGGER sync_iddoc_on_solution_delete
AFTER DELETE
ON mto_solution
FOR EACH ROW
WHEN (OLD.mto_common_solution_key IN ('INNOVATION', 'ACO_OS'))
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

-- Add trigger to mto_milestone for IDDOC_SUPPORT changes
CREATE TRIGGER sync_iddoc_on_milestone_insert
AFTER INSERT
ON mto_milestone
FOR EACH ROW
WHEN (NEW.mto_common_milestone_key = 'IDDOC_SUPPORT')
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

CREATE TRIGGER sync_iddoc_on_milestone_update
AFTER UPDATE OF mto_common_milestone_key
ON mto_milestone
FOR EACH ROW
WHEN (
    (NEW.mto_common_milestone_key = 'IDDOC_SUPPORT') OR
    (OLD.mto_common_milestone_key = 'IDDOC_SUPPORT')
)
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

CREATE TRIGGER sync_iddoc_on_milestone_delete
AFTER DELETE
ON mto_milestone
FOR EACH ROW
WHEN (OLD.mto_common_milestone_key = 'IDDOC_SUPPORT')
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

-- Add comments
COMMENT ON FUNCTION sync_iddoc_questionnaire_needed() IS
'Automatically syncs the iddoc_questionnaire.needed field based on three business rules: '
'1) plan_ops_eval_and_learning.iddoc_support = true, '
'2) INNOVATION or ACO_OS solution exists, '
'3) IDDOC_SUPPORT milestone exists. '
'Sets needed=true when any condition is met, needed=false when no conditions are met. '
'Sets modified_by to the MINT system account (required by audit NOT NULL constraint) — '
'the application explicitly excludes this UUID when inferring user-driven IN_PROGRESS status.';

COMMENT ON TRIGGER sync_iddoc_on_oel_update ON plan_ops_eval_and_learning IS
'Triggers IDDOC questionnaire needed field sync when iddoc_support field changes';

COMMENT ON TRIGGER sync_iddoc_on_solution_insert ON mto_solution IS
'Triggers IDDOC questionnaire needed field sync when INNOVATION or ACO_OS solution is inserted';

COMMENT ON TRIGGER sync_iddoc_on_solution_update ON mto_solution IS
'Triggers IDDOC questionnaire needed field sync when INNOVATION or ACO_OS solution is updated';

COMMENT ON TRIGGER sync_iddoc_on_solution_delete ON mto_solution IS
'Triggers IDDOC questionnaire needed field sync when INNOVATION or ACO_OS solution is deleted';

COMMENT ON TRIGGER sync_iddoc_on_milestone_insert ON mto_milestone IS
'Triggers IDDOC questionnaire needed field sync when IDDOC_SUPPORT milestone is inserted';

COMMENT ON TRIGGER sync_iddoc_on_milestone_update ON mto_milestone IS
'Triggers IDDOC questionnaire needed field sync when IDDOC_SUPPORT milestone is updated';

COMMENT ON TRIGGER sync_iddoc_on_milestone_delete ON mto_milestone IS
'Triggers IDDOC questionnaire needed field sync when IDDOC_SUPPORT milestone is deleted';
