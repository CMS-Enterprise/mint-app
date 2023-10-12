DROP TRIGGER collaborator_lead_req_update ON plan_collaborator;
DROP TRIGGER collaborator_lead_req_delete ON plan_collaborator;
DROP FUNCTION collaborator_role_check_trigger();

ALTER TABLE plan_collaborator RENAME COLUMN team_role TO team_roles;

-- Alter the team_roles column to be an array of team_role enum and convert existing values to array format
ALTER TABLE plan_collaborator
  ALTER COLUMN team_roles TYPE team_role[] USING ARRAY[team_roles];

CREATE FUNCTION collaborator_role_check_trigger() RETURNS TRIGGER AS $role_check$
BEGIN
  -- Check if 'MODEL_LEAD' exists in the team_roles array for the given model_plan_id
  IF (
       SELECT count(*)
       FROM plan_collaborator
       WHERE 'MODEL_LEAD' = ANY(team_roles) AND model_plan_id = OLD.model_plan_id
     ) < 2 THEN
    RAISE EXCEPTION 'There must be at least one MODEL_LEAD assigned to each model plan';
  END IF;

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END
$role_check$ LANGUAGE plpgsql;

CREATE TRIGGER collaborator_lead_req_update
  BEFORE UPDATE ON plan_collaborator
  FOR EACH ROW
  WHEN ('MODEL_LEAD' = ANY(old.team_roles) AND 'MODEL_LEAD' != ANY(new.team_roles))
EXECUTE FUNCTION COLLABORATOR_ROLE_CHECK_TRIGGER();

CREATE TRIGGER collaborator_lead_req_delete
  BEFORE DELETE ON plan_collaborator
  FOR EACH ROW
  WHEN ('MODEL_LEAD' = ANY(old.team_roles))
EXECUTE FUNCTION COLLABORATOR_ROLE_CHECK_TRIGGER();
