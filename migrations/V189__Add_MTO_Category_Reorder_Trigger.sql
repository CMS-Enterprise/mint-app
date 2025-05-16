CREATE OR REPLACE FUNCTION update_position_based_on_parent_and_model_plan()
RETURNS TRIGGER AS $$

DECLARE
    /*
     This determines if we need to add or subtract a value from the position. It should be +1 or -1
    */
    position_adjustment INT;
    deleted_user_uuid UUID = '00000000-0000-0000-0000-000000000000'; -- default to unknown user
BEGIN

    -- Avoid recursion by checking pg_trigger_depth()
    -- depth of 0 means not created from inside a trigger
    IF pg_trigger_depth() > 1 THEN
        RETURN NEW;
    END IF;

    -- Handle Insert: Adjust positions of other categories if the inserted position conflicts
    IF TG_OP = 'INSERT' THEN
        -- Move categories with the same parent_id and model_plan_id that have a position >= NEW.position
        position_adjustment := 1;  -- For insert, we increase positions of conflicting rows
        UPDATE mto_category
        SET position = position + position_adjustment,
            modified_by = NEW.modified_by,
            modified_dts = NEW.modified_dts
        WHERE ((parent_id IS NULL AND NEW.parent_id IS NULL) OR (parent_id = NEW.parent_id))
          AND ((model_plan_id IS NULL AND NEW.model_plan_id IS NULL) OR (model_plan_id = NEW.model_plan_id))
          AND position >= NEW.position
          AND id != NEW.id;  -- Exclude the newly inserted row
    
    -- Handle Update: Reorder positions when a row's position is changed 
    ELSIF TG_OP = 'UPDATE' THEN
    /* Prevent updates to model_plan_id as categories cannot move from one model plan to another */
    IF OLD.model_plan_id IS DISTINCT FROM NEW.model_plan_id THEN
        RAISE EXCEPTION 'updating model_plan_id is not allowed. Caught in trigger function update_position_based_on_parent_and_model_plan';
    END IF;

        /*
        Handle the old parent changes like a delete, move all lower categories up one for old parent
        */
        IF OLD.parent_id IS DISTINCT FROM NEW.parent_id THEN
        UPDATE mto_category
        SET position = position - 1,
            modified_by = NEW.modified_by,
            modified_dts = NEW.modified_dts
        WHERE ((parent_id IS NULL AND OLD.parent_id IS NULL) OR (parent_id = OLD.parent_id))
          AND ((model_plan_id IS NULL AND OLD.model_plan_id IS NULL) OR (model_plan_id = OLD.model_plan_id))
          AND position > OLD.position
          AND id != OLD.id;  -- Exclude the deleted row

          /* 
          Handle the new row position like an insert
          */

        -- Move categories with the same parent_id and model_plan_id that have a position >= NEW.position
        position_adjustment := 1;  -- For insert, we increase positions of conflicting rows
        UPDATE mto_category
        SET position = position + position_adjustment,
            modified_by = NEW.modified_by,
            modified_dts = NEW.modified_dts
        WHERE ((parent_id IS NULL AND NEW.parent_id IS NULL) OR (parent_id = NEW.parent_id))
          AND ((model_plan_id IS NULL AND NEW.model_plan_id IS NULL) OR (model_plan_id = NEW.model_plan_id))
          AND position >= NEW.position
          AND id != NEW.id;  -- Exclude the newly inserted row

        -- Make this a distinct check to see if position has changed at all. If not, don't trigger this.
        ELSIF OLD.parent_id IS NOT DISTINCT FROM NEW.parent_id  THEN
            -- If the position is unchanged, no further action is required    
            IF NEW.position = OLD.position THEN
                RETURN NEW;
            -- Determine if record moved up or down
            ELSIF NEW.position > OLD.position THEN
                position_adjustment := -1;
            ELSE
                position_adjustment := 1;
            END IF;
            IF position_adjustment = -1 THEN
            /* Row moved down: Shift rows in the range [OLD.position + 1, NEW.position] up by 1 */
                UPDATE mto_category
                SET position = position + position_adjustment, 
                    modified_by = NEW.modified_by,
                    modified_dts = NEW.modified_dts
                WHERE ((parent_id IS NULL AND NEW.parent_id IS NULL) OR (parent_id = NEW.parent_id))
                  AND ((model_plan_id IS NULL AND NEW.model_plan_id IS NULL) OR (model_plan_id = NEW.model_plan_id))
                  AND position > OLD.position AND position <= NEW.position
                  AND id != NEW.id;  -- Exclude the updated row
            ELSIF position_adjustment = 1 THEN
            /* Row moved up: Shift rows in the range [NEW.position, OLD.position - 1] down by 1 */
                UPDATE mto_category
                SET position = position + position_adjustment,
                    modified_by = NEW.modified_by,
                    modified_dts = NEW.modified_dts
                WHERE ((parent_id IS NULL AND NEW.parent_id IS NULL) OR (parent_id = NEW.parent_id))
                  AND ((model_plan_id IS NULL AND NEW.model_plan_id IS NULL) OR (model_plan_id = NEW.model_plan_id))
                  AND position < OLD.position AND position >= NEW.position
                  AND id != NEW.id;  -- Exclude the updated row
            END IF;
        END IF;

    -- Handle Delete: Move positions up for all categories after the deleted category
    ELSIF TG_OP = 'DELETE' THEN
        deleted_user_uuid = COALESCE(current_setting('app.current_user',TRUE),'00000000-0000-0000-0000-000000000000'); --Try to get user from variable, if not will default to unknown
        UPDATE mto_category
        SET position = position - 1,
            modified_by = deleted_user_uuid,
            modified_dts = OLD.modified_dts
        WHERE ((parent_id IS NULL AND OLD.parent_id IS NULL) OR (parent_id = OLD.parent_id))
          AND ((model_plan_id IS NULL AND OLD.model_plan_id IS NULL) OR (model_plan_id = OLD.model_plan_id))
          AND position > OLD.position
          AND id != OLD.id;  -- Exclude the deleted row
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION update_position_based_on_parent_and_model_plan() IS
'This function is a trigger handler that manages adjustments to the position of rows in the mto_category table.
It is invoked automatically after INSERT, UPDATE, or DELETE operations on the mto_category table.
The function performs the following actions:

1. When a new record is inserted (INSERT):
   - It checks for existing records in the same parent-child and model-plan context that have a position greater than or equal to the new record’s position.
   - The position of those records is incremented by 1 to make space for the new record at its intended position.

2. When an existing record is updated (UPDATE):
   - It compares the old position with the new position to determine whether the record moved up or down.
   - Based on this comparison, it adjusts the positions of other records either by shifting them up or down, ensuring that no gaps or overlaps occur in the sequence.

3. When a record is deleted (DELETE):
   - It decreases the position of all records that are positioned below the deleted record’s original position, effectively "closing the gap" left by the deleted record.

The function ensures that records are ordered sequentially within the same parent-child and model-plan context, maintaining the integrity of the position values across insert, update, and delete actions.';

CREATE TRIGGER update_position_trigger
AFTER INSERT OR UPDATE OR DELETE ON mto_category
FOR EACH ROW
EXECUTE FUNCTION update_position_based_on_parent_and_model_plan();


COMMENT ON TRIGGER update_position_trigger ON mto_category IS
'This trigger is responsible for invoking the update_position_based_on_parent_and_model_plan() function after any INSERT, UPDATE, or DELETE operation on the mto_category table.
It ensures that position adjustments are performed automatically whenever a change is made to a record in the mto_category table.
The trigger operates on each row affected by the INSERT, UPDATE, or DELETE operation, invoking the associated function to handle position management according to the type of operation performed.
- INSERT: The trigger causes the function to adjust the position of other records when a new record is inserted.
- UPDATE: The trigger ensures that any change in position will trigger adjustments for other records that might be affected by the position change.
- DELETE: The trigger makes sure the function handles the case where a record is deleted and the remaining records positions need to be adjusted accordingly.
The trigger guarantees that the integrity of the positions in the mto_category table is always maintained, ensuring proper ordering and minimizing potential conflicts between records.';
