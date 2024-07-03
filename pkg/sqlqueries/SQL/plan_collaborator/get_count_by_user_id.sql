SELECT COUNT(user_id)
FROM public.plan_collaborator
WHERE user_id = :user_id;
