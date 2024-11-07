CREATE OR REPLACE FUNCTION update_position_based_on_parent_and_model_plan()
RETURNS TRIGGER AS $$

BEGIN
    -- Handle Insert: Adjust positions of other categories if the inserted position conflicts
    IF TG_OP = 'INSERT' THEN
        -- Move categories with the same parent_id and model_plan_id that have a position >= NEW.position
        UPDATE mto_category
        SET position = position + 1
        WHERE parent_id = NEW.parent_id
          AND model_plan_id = NEW.model_plan_id
          AND position >= NEW.position;
    
    -- Handle Update: Reorder positions when a row's position is changed
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle position change within the same parent_id and model_plan_id
        IF OLD.parent_id = NEW.parent_id AND OLD.model_plan_id = NEW.model_plan_id AND OLD.position != NEW.position THEN
            -- Move categories that are in the way: move others by +1 if positions conflict
            IF NEW.position > OLD.position THEN
                UPDATE mto_category
                SET position = position - 1
                WHERE parent_id = NEW.parent_id
                  AND model_plan_id = NEW.model_plan_id
                  AND position > OLD.position AND position <= NEW.position;
            ELSIF NEW.position < OLD.position THEN
                UPDATE mto_category
                SET position = position + 1
                WHERE parent_id = NEW.parent_id
                  AND model_plan_id = NEW.model_plan_id
                  AND position < OLD.position AND position >= NEW.position;
            END IF;
        -- Handle parent_id change (moving the category to a new parent)
        ELSIF OLD.parent_id != NEW.parent_id OR OLD.model_plan_id != NEW.model_plan_id THEN
            -- Handle deletion of the category from the old parent
            UPDATE mto_category
            SET position = position + 1
            WHERE parent_id = OLD.parent_id
              AND model_plan_id = OLD.model_plan_id
              AND position > OLD.position;

            -- Handle insertion of the category into the new parent
            UPDATE mto_category
            SET position = position - 1
            WHERE parent_id = NEW.parent_id
              AND model_plan_id = NEW.model_plan_id
              AND position >= NEW.position;
        END IF;

    -- Handle Delete: Move positions up for all categories after the deleted category
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE mto_category
        SET position = position - 1
        WHERE parent_id = OLD.parent_id
          AND model_plan_id = OLD.model_plan_id
          AND position > OLD.position;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_position_trigger
AFTER INSERT OR UPDATE ON mto_category
FOR EACH ROW
EXECUTE FUNCTION update_position_based_on_parent_and_model_plan();
