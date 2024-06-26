SELECT
    os.id               AS operational_solution_id,
    mp.id               AS model_plan_id
FROM
    model_plan AS mp
INNER JOIN operational_need AS opn ON mp.id = opn.model_plan_id
INNER JOIN operational_solution AS os ON opn.id = os.operational_need_id
INNER JOIN possible_operational_solution AS pos ON os.solution_type = pos.id
LEFT JOIN possible_need_solution_link AS pnsl ON pos.id = pnsl.solution_type AND opn.need_type = pnsl.need_type
WHERE
    pos.sol_key = :operational_solution_key
ORDER BY
    pos.sol_key, mp.status;
