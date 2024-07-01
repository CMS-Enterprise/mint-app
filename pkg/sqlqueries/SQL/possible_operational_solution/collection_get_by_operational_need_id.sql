SELECT
    POS.id,
    POS.sol_name,
    POS.sol_key,
    POS.treat_as_other,
    POS.filter_view,
    POS.created_by,
    POS.created_dts,
    POS.modified_by,
    POS.modified_dts
FROM
    possible_operational_solution AS POS
INNER JOIN possible_need_solution_link AS PNSL ON PNSL.solution_type = POS.id
INNER JOIN possible_operational_need AS PON ON PON.id = PNSL.need_type
INNER JOIN operational_need AS OpN ON OpN.need_type = PNSL.need_type
WHERE OpN.id = :operational_need_id
ORDER BY POS.ID ASC
