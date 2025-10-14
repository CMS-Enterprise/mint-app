-- Add the column with foreign key constraint
ALTER TABLE mto_milestone
ADD ASSIGNED_TO UUID REFERENCES plan_collaborator(id) ON DELETE SET NULL DEFAULT NULL;

-- Create a function to enforce that the assigned collaborator belongs to the same model plan
CREATE OR REPLACE FUNCTION check_milestone_assigned_to_same_model_plan()
RETURNS TRIGGER AS $$
BEGIN
    -- If assigned_to is NULL, allow it
    IF NEW.assigned_to IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Check if the assigned collaborator belongs to the same model plan
    IF NOT EXISTS (
        SELECT 1 FROM plan_collaborator pc 
        WHERE pc.id = NEW.assigned_to 
        AND pc.model_plan_id = NEW.model_plan_id
    ) THEN
        RAISE EXCEPTION 'Cannot assign milestone to collaborator: collaborator % does not belong to model plan %', 
            NEW.assigned_to, NEW.model_plan_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce the constraint on INSERT and UPDATE
CREATE TRIGGER trigger_check_milestone_assigned_to_same_model_plan
BEFORE INSERT OR UPDATE ON mto_milestone
FOR EACH ROW
EXECUTE FUNCTION check_milestone_assigned_to_same_model_plan();
