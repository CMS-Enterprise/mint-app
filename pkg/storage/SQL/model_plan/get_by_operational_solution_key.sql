SELECT
    pos.sol_key,
    pos.sol_name,
    os.id               AS operational_solution_id,
    os.operational_need_id,
    os.needed,
    os.solution_type,
    os.name_other,
    os.poc_name,
    os.poc_email,
    os.must_start_dts,
    os.must_finish_dts,
    os.is_other,
    pnsl.id IS NOT NULL AS is_common_solution,
    os.other_header,
    os.status           AS operational_solution_status,
    os.created_by       AS operational_solution_created_by,
    os.created_dts      AS operational_solution_created_dts,
    os.modified_by      AS operational_solution_modified_by,
    os.modified_dts     AS operational_solution_modified_dts,
    mp.id               AS model_plan_id,
    mp.model_name,
    mp.abbreviation,
    mp.status           AS model_plan_status,
    mp.archived,
    mp.created_by AS model_plan_created_by,
    mp.created_dts AS model_plan_created_dts,
    mp.modified_by AS model_plan_modified_by,
    mp.modified_dts AS model_plan_modified_dts
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
