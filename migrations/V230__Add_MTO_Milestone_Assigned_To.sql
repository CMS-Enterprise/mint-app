-- Add the column with foreign key constraint
ALTER TABLE mto_milestone
ADD ASSIGNED_TO UUID REFERENCES user_account(id) ON DELETE SET NULL DEFAULT NULL;

-- Add index for performance optimization
CREATE INDEX IF NOT EXISTS idx_mto_milestone_modelplan_assigned_to
ON public.mto_milestone (model_plan_id, assigned_to);

-- Create trigger function to unassign milestones when a collaborator is deleted
CREATE OR REPLACE FUNCTION public.unassign_milestones_after_collaborator_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.mto_milestone
     SET assigned_to = NULL
   WHERE model_plan_id = OLD.model_plan_id
     AND assigned_to  = OLD.user_id;
  RETURN NULL;
END;
$$;

-- Create trigger on plan_collaborator table to call the function after delete
CREATE TRIGGER plan_collaborator_after_delete_unassign
AFTER DELETE ON public.plan_collaborator
FOR EACH ROW
EXECUTE FUNCTION public.unassign_milestones_after_collaborator_delete();
