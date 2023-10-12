BEGIN;

DROP TRIGGER collaborator_lead_req_update ON plan_collaborator;
DROP TRIGGER collaborator_lead_req_delete ON plan_collaborator;

ALTER TABLE plan_collaborator RENAME COLUMN team_role TO team_roles;

-- Alter the team_roles column to be an array of team_role enum and convert existing values to array format
ALTER TABLE plan_collaborator
  ALTER COLUMN team_roles TYPE team_role[] USING ARRAY[team_roles];

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

COMMIT;