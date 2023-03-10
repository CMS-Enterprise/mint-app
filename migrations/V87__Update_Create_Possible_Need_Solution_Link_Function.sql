/* Create the Function */
CREATE FUNCTION CREATE_POSSIBLE_NEED_SOLUTION_LINK(possibleNeedKey OPERATIONAL_NEED_KEY, possibleSolutionKeys OPERATIONAL_SOLUTION_KEY[]) RETURNS VOID AS $body$
BEGIN
WITH OPSolKey AS
(
	SELECT
	unnest(possibleSolutionKeys) AS SolKey
	,possibleNeedKey AS NeedKey
),
ENTRIES AS 
(
SELECT OPSolKey.SolKey, pos.id as SolID, OPSolKey.NeedKey, pon.id as NeedID FROM OPSolKey 
	JOIN possible_operational_solution AS pos on pos.sol_key = OPSolKey.SolKey
	JOIN possible_operational_need AS pon on pon.need_key = OPSolKey.NeedKey
)
INSERT INTO possible_need_solution_link (
        need_type,
        solution_type,
        created_by
)
SELECT NeedID,SolID,'00000001-0001-0001-0001-000000000001' FROM ENTRIES; --System Account

END
$body$ LANGUAGE plpgsql;

/* Update the Links */

/* TODO: get the rest of the links working */
SELECT CREATE_POSSIBLE_NEED_SOLUTION_LINK('MANAGE_CD'::OPERATIONAL_NEED_KEY, '{MARX}'::OPERATIONAL_SOLUTION_KEY[]);
