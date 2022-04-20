DELETE FROM plan_collaborator
WHERE plan_collaborator.id = :id
RETURNING *;