UPDATE user_view_customization
SET
    user_id = :user_id,
    view_customization = :view_customization,
    possible_operational_solutions = :possible_operational_solutions
WHERE user_id = :user_id
RETURNING
id,
user_id,
view_customization,
possible_operational_solutions,
created_by,
created_dts,
modified_by,
modified_dts;
