-- Create a function to sync the IDDOC questionnaire needed field based on trigger conditions
CREATE OR REPLACE FUNCTION sync_iddoc_questionnaire_needed()
RETURNS TRIGGER AS $$
DECLARE
    v_model_plan_id UUID;
    v_needed BOOLEAN;
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
    ) INTO v_needed;

    -- Upsert the needed field in iddoc_questionnaire
    INSERT INTO iddoc_questionnaire (
        id,
        model_plan_id,
        needed,
        created_by,
        modified_by
    )
    VALUES (
        gen_random_uuid(),
        v_model_plan_id,
        v_needed,
        COALESCE(NEW.modified_by, NEW.created_by, OLD.modified_by, OLD.created_by),
        COALESCE(NEW.modified_by, NEW.created_by, OLD.modified_by, OLD.created_by)
    )
    ON CONFLICT (model_plan_id)
    DO UPDATE SET
        needed = EXCLUDED.needed,
        modified_by = EXCLUDED.modified_by,
        modified_dts = CURRENT_TIMESTAMP;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add trigger to plan_ops_eval_and_learning for iddoc_support changes
CREATE TRIGGER sync_iddoc_on_oel_change
AFTER INSERT OR UPDATE OF iddoc_support OR DELETE
ON plan_ops_eval_and_learning
FOR EACH ROW
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

-- Add trigger to mto_solution for INNOVATION/ACO_OS changes
CREATE TRIGGER sync_iddoc_on_solution_change
AFTER INSERT OR UPDATE OF mto_common_solution_key OR DELETE
ON mto_solution
FOR EACH ROW
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

-- Add trigger to mto_milestone for IDDOC_SUPPORT changes
CREATE TRIGGER sync_iddoc_on_milestone_change
AFTER INSERT OR UPDATE OF mto_common_milestone_key OR DELETE
ON mto_milestone
FOR EACH ROW
EXECUTE FUNCTION sync_iddoc_questionnaire_needed();

-- Add comments
COMMENT ON FUNCTION sync_iddoc_questionnaire_needed() IS
'Automatically syncs the iddoc_questionnaire.needed field based on three conditions: '
'1) plan_ops_eval_and_learning.iddoc_support = true, '
'2) INNOVATION or ACO_OS solution exists, '
'3) IDDOC_SUPPORT milestone exists';

COMMENT ON TRIGGER sync_iddoc_on_oel_change ON plan_ops_eval_and_learning IS
'Triggers IDDOC questionnaire needed sync when iddoc_support field changes';

COMMENT ON TRIGGER sync_iddoc_on_solution_change ON mto_solution IS
'Triggers IDDOC questionnaire needed sync when INNOVATION or ACO_OS solution is added, modified, or deleted';

COMMENT ON TRIGGER sync_iddoc_on_milestone_change ON mto_milestone IS
'Triggers IDDOC questionnaire needed sync when IDDOC_SUPPORT milestone is added, modified, or deleted';
