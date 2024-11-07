CREATE OR REPLACE FUNCTION update_position_based_on_parent_and_model_plan()
RETURNS TRIGGER AS $$

BEGIN

    -- Avoid recursion by checking pg_trigger_depth()
    -- depth of 0 means not created from inside a trigger
    IF pg_trigger_depth() > 1 THEN
        RETURN NEW;
    END IF;

    -- Handle Insert: Adjust positions of other categories if the inserted position conflicts
    IF TG_OP = 'INSERT' THEN
        -- Move categories with the same parent_id and model_plan_id that have a position >= NEW.position
        UPDATE mto_category
        SET position = position + 1,
        modified_by = NEW.modified_by,
        modified_dts = NEW.modified_dts
        WHERE (parent_id IS NULL AND NEW.parent_id IS NULL OR parent_id = NEW.parent_id)
          AND (model_plan_id IS NULL AND NEW.model_plan_id IS NULL OR model_plan_id = NEW.model_plan_id)
          AND position >= NEW.position
          AND id != NEW.id;  -- Exclude the newly inserted row
    
    -- Handle Update: Reorder positions when a row's position is changed 
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle position change within the same parent_id and model_plan_id
        IF OLD.parent_id IS  DISTINCT FROM NEW.parent_id AND OLD.model_plan_id IS  DISTINCT FROM NEW.model_plan_id THEN
            -- If the parent_id or model_plan_id changes, adjust positions for both
            -- Handle deletion of the category from the old parent
            UPDATE mto_category
            SET position = position + 1,
            modified_by = NEW.modified_by,
            modified_dts = NEW.modified_dts
            WHERE (parent_id IS NULL AND OLD.parent_id IS NULL OR parent_id = OLD.parent_id)
              AND (model_plan_id IS NULL AND OLD.model_plan_id IS NULL OR model_plan_id = OLD.model_plan_id)
              AND position > OLD.position
              AND id != NEW.id;  -- Exclude the updated row
            
            -- Handle insertion of the category into the new parent
            UPDATE mto_category
            SET position = position - 1,
            modified_by = NEW.modified_by,
            modified_dts = NEW.modified_dts
            WHERE (parent_id IS NULL AND NEW.parent_id IS NULL OR parent_id = NEW.parent_id)
              AND (model_plan_id IS NULL AND NEW.model_plan_id IS NULL OR model_plan_id = NEW.model_plan_id)
              AND position >= NEW.position
              AND id != NEW.id;  -- Exclude the updated row
        ELSIF OLD.parent_id IS NOT DISTINCT FROM NEW.parent_id OR OLD.model_plan_id IS NOT DISTINCT FROM NEW.model_plan_id THEN
            -- Handle the case where the position is changed without changing parent_id or model_plan_id
            IF NEW.position > OLD.position THEN
                UPDATE mto_category
                SET position = position - 1,
                modified_by = NEW.modified_by,
                modified_dts = NEW.modified_dts
                WHERE (parent_id IS NULL AND NEW.parent_id IS NULL OR parent_id = NEW.parent_id)
                  AND (model_plan_id IS NULL AND NEW.model_plan_id IS NULL OR model_plan_id = NEW.model_plan_id)
                  AND position > OLD.position AND position <= NEW.position
                  AND id != NEW.id;  -- Exclude the updated row
            ELSIF NEW.position < OLD.position THEN
                UPDATE mto_category
                SET position = position + 1,
            modified_by = NEW.modified_by,
            modified_dts = NEW.modified_dts
                WHERE (parent_id IS NULL AND NEW.parent_id IS NULL OR parent_id = NEW.parent_id)
                  AND (model_plan_id IS NULL AND NEW.model_plan_id IS NULL OR model_plan_id = NEW.model_plan_id)
                  AND position < OLD.position AND position >= NEW.position
                  AND id != NEW.id;  -- Exclude the updated row
            END IF;
        END IF;

    -- Handle Delete: Move positions up for all categories after the deleted category
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE mto_category
        SET position = position - 1,
            modified_by = OLD.modified_by,
            modified_dts = OLD.modified_dts
        WHERE (parent_id IS NULL AND OLD.parent_id IS NULL OR parent_id = OLD.parent_id)
          AND (model_plan_id IS NULL AND OLD.model_plan_id IS NULL OR model_plan_id = OLD.model_plan_id)
          AND position > OLD.position
          AND id != OLD.id;  -- Exclude the deleted row
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER update_position_trigger
AFTER INSERT OR UPDATE OR DELETE ON mto_category
FOR EACH ROW
EXECUTE FUNCTION update_position_based_on_parent_and_model_plan();
