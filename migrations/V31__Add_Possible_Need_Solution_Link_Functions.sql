CREATE FUNCTION CREATE_POSSIBLE_NEED_SOLULTION_LINK(possibleNeedKey OPERATIONAL_NEED_KEY, possibleSolutionKeys OPERATIONAL_SOLUTION_KEY[]) RETURNS VOID AS $body$
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
SELECT NeedID,SolID,'MINT' FROM ENTRIES;

END
$body$ LANGUAGE plpgsql;
