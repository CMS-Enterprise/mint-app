-- SELECT public.ADD_OPERATIONAL_NEED_NEEDED_TRIGGER('public', 'plan_basics'); -- no records currently are based on basics

SELECT public.ADD_OPERATIONAL_NEED_NEEDED_TRIGGER('public', 'plan_beneficiaries');

SELECT public.ADD_OPERATIONAL_NEED_NEEDED_TRIGGER('public', 'plan_general_characteristics');

SELECT public.ADD_OPERATIONAL_NEED_NEEDED_TRIGGER('public', 'plan_ops_eval_and_learning');

SELECT public.ADD_OPERATIONAL_NEED_NEEDED_TRIGGER('public', 'plan_participants_and_providers');

SELECT public.ADD_OPERATIONAL_NEED_NEEDED_TRIGGER('public', 'plan_payments');
