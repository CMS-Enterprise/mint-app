SELECT
    POS.id,
    POS.name,
    POS.key,
    POS.created_by,
    POS.created_dts,
    POS.modified_by,
    POS.modified_dts
FROM
    possible_operational_solution AS POS
INNER JOIN possible_need_solution_link AS PNSL ON PNSL.solution_type = POS.id
INNER JOIN possible_operational_need AS PON ON PON.id = PNSL.need_type
WHERE pon.key = :need_type
ORDER BY POS.ID ASC
