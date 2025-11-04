-- Add the column with foreign key constraint
ALTER TABLE mto_milestone
ADD ASSIGNED_TO UUID REFERENCES plan_collaborator(id) ON DELETE SET NULL DEFAULT NULL;

-- Add unique constraint on plan_collaborator to support composite foreign key
ALTER TABLE plan_collaborator
ADD CONSTRAINT unique_collaborator_id_model_plan 
UNIQUE (id, model_plan_id);

-- Enforce the same model_plan_id for collaborator and milestone
ALTER TABLE mto_milestone
ADD CONSTRAINT fk_assigned_to_model_plan 
FOREIGN KEY (assigned_to, model_plan_id) 
REFERENCES plan_collaborator(id, model_plan_id);
-- Comment for the foreign key constraint enforcing the same model_plan_id for subcategories
COMMENT ON CONSTRAINT fk_assigned_to_model_plan ON mto_milestone IS
'Ensures that if a milestone is assigned to a collaborator, the model_plan_id of the milestone matches the model_plan_id of the collaborator.';
