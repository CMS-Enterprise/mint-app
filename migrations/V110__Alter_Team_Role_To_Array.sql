-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS collaborator_lead_req_update ON plan_collaborator;
DROP TRIGGER IF EXISTS collaborator_lead_req_delete ON plan_collaborator;
DROP FUNCTION IF EXISTS collaborator_role_check_trigger();

-- Rename team_role column to team_roles
ALTER TABLE plan_collaborator RENAME COLUMN team_role TO team_roles;

-- Convert the team_roles column to an array of team_role enum
ALTER TABLE plan_collaborator
  ALTER COLUMN team_roles TYPE team_role[] USING ARRAY[team_roles];

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION collaborator_role_check_trigger() RETURNS TRIGGER AS $role_check$
BEGIN
  -- For DELETE operations
  IF (TG_OP = 'DELETE') THEN
    -- If the roles being deleted contain "MODEL_LEAD"
    IF 'MODEL_LEAD' = ANY(OLD.team_roles) THEN
      -- Ensure there's another collaborator with the "MODEL_LEAD" role
      IF (
           SELECT count(*)
           FROM plan_collaborator
           WHERE 'MODEL_LEAD' = ANY(team_roles) AND model_plan_id = OLD.model_plan_id AND id != OLD.id
         ) = 0 THEN
        RAISE EXCEPTION 'There must be at least one MODEL_LEAD assigned to each model plan';
      END IF;
    END IF;
    RETURN OLD;

    -- For UPDATE operations
  ELSEIF (TG_OP = 'UPDATE') THEN
    -- If the old roles contained "MODEL_LEAD" but the new roles do not
    IF 'MODEL_LEAD' = ANY(OLD.team_roles) AND NOT ('MODEL_LEAD' = ANY(NEW.team_roles)) THEN
      -- Ensure there's another collaborator with the "MODEL_LEAD" role
      IF (
           SELECT count(*)
           FROM plan_collaborator
           WHERE 'MODEL_LEAD' = ANY(team_roles) AND model_plan_id = OLD.model_plan_id AND id != NEW.id
         ) = 0 THEN
        RAISE EXCEPTION 'There must be at least one MODEL_LEAD assigned to each model plan';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL; -- This should never be reached, but it's good practice to have a default return
END
$role_check$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER collaborator_lead_req_update
  BEFORE UPDATE ON plan_collaborator
  FOR EACH ROW
  WHEN ('MODEL_LEAD' = ANY(OLD.team_roles) AND NOT ('MODEL_LEAD' = ANY(NEW.team_roles)))
EXECUTE FUNCTION collaborator_role_check_trigger();

CREATE TRIGGER collaborator_lead_req_delete
  BEFORE DELETE ON plan_collaborator
  FOR EACH ROW
  WHEN ('MODEL_LEAD' = ANY(OLD.team_roles))
EXECUTE FUNCTION collaborator_role_check_trigger();

-- Trigger function to check for unique roles in team_roles array
CREATE FUNCTION ensure_unique_roles_trigger() RETURNS TRIGGER AS $unique_roles$
BEGIN
  IF ARRAY_LENGTH(NEW.team_roles, 1) != (SELECT COUNT(DISTINCT unnest_val) FROM unnest(NEW.team_roles) AS unnest_val) THEN
    RAISE EXCEPTION 'Duplicate roles are not allowed in team_roles';
  END IF;
  RETURN NEW;
END
$unique_roles$ LANGUAGE plpgsql;

-- Create trigger to ensure unique roles
CREATE TRIGGER ensure_unique_roles
  BEFORE INSERT OR UPDATE ON plan_collaborator
  FOR EACH ROW
EXECUTE FUNCTION ensure_unique_roles_trigger();
