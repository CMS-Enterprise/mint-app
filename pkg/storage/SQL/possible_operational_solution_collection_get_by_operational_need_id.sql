SELECT
    POS.id,
    POS.full_name,
    POS.short_name,
    POS.created_by,
    POS.created_dts,
    POS.modified_by,
    POS.modified_dts
FROM
    possible_operational_solution AS POS
    JOIN possible_need_solution_link AS PNSL ON PNSL.solution_type = POS.id
    JOIN possible_operational_need AS PON ON PON.id = PNSL.need_type
    JOIN operational_need OpN ON OpN.need_type = PNSL.need_type
WHERE OpN.id = :operational_need_id
ORDER BY POS.ID ASC