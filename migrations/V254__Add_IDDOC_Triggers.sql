-- Create a function to sync the IDDOC questionnaire status field based on trigger conditions
CREATE OR REPLACE FUNCTION sync_iddoc_questionnaire_needed()
RETURNS TRIGGER AS $$
DECLARE
    v_model_plan_id UUID;
    v_should_be_needed BOOLEAN;
    v_should_process BOOLEAN := FALSE;
    v_current_status IDDOC_QUESTIONNAIRE_STATUS;
    v_new_status IDDOC_QUESTIONNAIRE_STATUS;
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

    -- Get current status from iddoc_questionnaire
    SELECT status INTO v_current_status
    FROM iddoc_questionnaire
    WHERE model_plan_id = v_model_plan_id;

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

    -- Determine new status based on conditions
    IF v_should_be_needed THEN
        -- Conditions are met: IDDOC is needed
        -- Transition from NOT_NEEDED to NOT_STARTED
        -- Don't override IN_PROGRESS or COMPLETED (preserve user's work)
        IF v_current_status = 'NOT_NEEDED' THEN
            v_new_status := 'NOT_STARTED';
        ELSE
            -- Keep current status (IN_PROGRESS or COMPLETED)
            v_new_status := v_current_status;
        END IF;
    ELSE
        -- Conditions are not met: IDDOC is not needed
        -- Always set to NOT_NEEDED regardless of current status
        v_new_status := 'NOT_NEEDED';
    END IF;

    -- Update status if it changed
    IF v_new_status != v_current_status THEN
        UPDATE iddoc_questionnaire
        SET
            status = v_new_status,
            modified_by = COALESCE(NEW.modified_by, NEW.created_by, OLD.modified_by, OLD.created_by),
            modified_dts = CURRENT_TIMESTAMP
        WHERE model_plan_id = v_model_plan_id;
    END IF;

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
'Automatically syncs the iddoc_questionnaire.status field based on three conditions: '
'1) plan_ops_eval_and_learning.iddoc_support = true, '
'2) INNOVATION or ACO_OS solution exists, '
'3) IDDOC_SUPPORT milestone exists. '
'When conditions are met and status is NOT_NEEDED, transitions to NOT_STARTED. '
'When conditions are not met, always sets status to NOT_NEEDED. '
'Preserves IN_PROGRESS and COMPLETED statuses when conditions remain met.';

COMMENT ON TRIGGER sync_iddoc_on_oel_update ON plan_ops_eval_and_learning IS
'Triggers IDDOC questionnaire status sync when iddoc_support field changes';

COMMENT ON TRIGGER sync_iddoc_on_solution_insert ON mto_solution IS
'Triggers IDDOC questionnaire status sync when INNOVATION or ACO_OS solution is inserted';

COMMENT ON TRIGGER sync_iddoc_on_solution_update ON mto_solution IS
'Triggers IDDOC questionnaire status sync when INNOVATION or ACO_OS solution is updated';

COMMENT ON TRIGGER sync_iddoc_on_solution_delete ON mto_solution IS
'Triggers IDDOC questionnaire status sync when INNOVATION or ACO_OS solution is deleted';

COMMENT ON TRIGGER sync_iddoc_on_milestone_insert ON mto_milestone IS
'Triggers IDDOC questionnaire status sync when IDDOC_SUPPORT milestone is inserted';

COMMENT ON TRIGGER sync_iddoc_on_milestone_update ON mto_milestone IS
'Triggers IDDOC questionnaire status sync when IDDOC_SUPPORT milestone is updated';

COMMENT ON TRIGGER sync_iddoc_on_milestone_delete ON mto_milestone IS
'Triggers IDDOC questionnaire status sync when IDDOC_SUPPORT milestone is deleted';
