-- CREATE FUNCTION audit_trigger() RETURNS TRIGGER AS $audit_table$
-- BEGIN
--     -- This is used in a before trigger, so we say <2 to check the existing count
--     -- before allowing the change, vs making the change and rolling back
--     IF (
--         SELECT count(*)
--         FROM plan_collaborator
--         WHERE team_role = 'MODEL_LEAD' and model_plan_id = OLD.model_plan_id 
--     ) <2 THEN
--         RAISE EXCEPTION 'There must be at least one MODEL_LEAD assigned to each model plan';
--     END IF;
--     IF (TG_OP = 'DELETE') THEN
--         RETURN OLD;
--     ELSE
--         RETURN NEW;
--     END IF;
-- END
-- $audit_table$ LANGUAGE plpgsql;


-- CREATE TRIGGER collaborator_lead_req_update
-- BEFORE UPDATE ON plan_collaborator
-- FOR EACH ROW
-- WHEN ((old.team_role = 'MODEL_LEAD') AND (new.team_role != 'MODEL_LEAD'))
-- EXECUTE FUNCTION audit_trigger();


-- CREATE TRIGGER collaborator_lead_req_delete
-- BEFORE DELETE ON plan_collaborator
-- FOR EACH ROW
-- WHEN (old.team_role = 'MODEL_LEAD')
-- EXECUTE FUNCTION audit_trigger();
