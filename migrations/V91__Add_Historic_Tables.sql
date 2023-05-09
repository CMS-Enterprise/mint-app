ALTER TABLE model_plan
    ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);

CREATE TABLE model_plan_history (LIKE model_plan);

CREATE TRIGGER versioning_trigger
BEFORE INSERT OR UPDATE OR DELETE ON model_plan
FOR EACH ROW EXECUTE PROCEDURE versioning(
  'sys_period', 'model_plan_history', true, true
);