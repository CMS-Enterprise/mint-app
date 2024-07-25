WITH solKeys AS (
    SELECT UNNEST(CAST( :sol_keys AS OPERATIONAL_SOLUTION_KEY[])) AS solKey
)

SELECT
    pos.id,
    pos.sol_name,
    pos.sol_key,
    pos.treat_as_other,
    pos.filter_view,
    pos.created_by,
    pos.created_dts,
    pos.modified_by,
    pos.modified_dts
FROM
    possible_operational_solution AS pos
INNER JOIN solKeys ON pos.sol_key = solKeys.solKey
