SELECT
    POS.id,
    POS.sol_name,
    POS.sol_key,
    POS.created_by,
    POS.created_dts,
    POS.modified_by,
    POS.modified_dts
FROM
    possible_operational_solution AS POS
ORDER BY POS.ID ASC
