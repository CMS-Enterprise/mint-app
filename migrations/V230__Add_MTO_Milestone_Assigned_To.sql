-- Add the column with foreign key constraint
ALTER TABLE mto_milestone
ADD ASSIGNED_TO UUID REFERENCES plan_collaborator(id) ON DELETE SET NULL DEFAULT NULL;
