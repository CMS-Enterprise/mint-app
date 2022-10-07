CREATE FUNCTION createPossibleNeedSolultionLink(possibleNeedKey OPERATIONAL_NEED_KEY, possibleSolutionKeys OPERATIONAL_SOLUTION_KEY[]) RETURNS VOID AS $body$
BEGIN
WITH OPSolKey AS
(
	SELECT
	unnest(possibleSolutionKeys) AS SolSHORT
	,possibleNeedKey AS NeedSHORT
),
ENTRIES AS 
(
SELECT OPSolKey.SolSHORT, pos.id as SolID, OPSolKey.NeedSHORT, pon.id as NeedID FROM OPSolKey 
	JOIN possible_operational_solution AS pos on pos.short_name = OPSolKey.SolSHORT
	JOIN possible_operational_need AS pon on pon.short_name = OPSolKey.NeedSHORT
)
INSERT INTO possible_need_solution_link (
        need_type,
        solution_type,
        created_by
)
SELECT NeedID,SolID,'MINT' FROM ENTRIES;

END
$body$ LANGUAGE plpgsql;
