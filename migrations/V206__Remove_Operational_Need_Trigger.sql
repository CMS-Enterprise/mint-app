-- Drop the triggers from each table
DROP TRIGGER IF EXISTS operational_need_trigger ON plan_beneficiaries;
DROP TRIGGER IF EXISTS operational_need_trigger ON plan_general_characteristics;
DROP TRIGGER IF EXISTS operational_need_trigger ON plan_ops_eval_and_learning;
DROP TRIGGER IF EXISTS operational_need_trigger ON plan_participants_and_providers;
DROP TRIGGER IF EXISTS operational_need_trigger ON plan_payments;

-- Drop the function that set operational need needed relies on
DROP FUNCTION IF EXISTS public.determine_section_needs(TEXT, UUID, HSTORE, TEXT[]) CASCADE;

-- Drop the trigger function (in the public schema)
DROP FUNCTION IF EXISTS set_operational_need_needed() CASCADE;

-- Drop this helper function for updating needs as needed or not on a model plan
DROP FUNCTION IF EXISTS public.determine_model_plan_needs(UUID) CASCADE;


-- Drop the helper trigger-creation function
DROP FUNCTION IF EXISTS public.add_operational_need_needed_trigger(TEXT, TEXT) CASCADE;
