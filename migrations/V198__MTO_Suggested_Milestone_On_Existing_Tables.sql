/*
/* Call this function with a cross join lateral to get the result for each possible milestone suggestion for each model plan */

*/

WITH milestoneSuggestions AS (

    SELECT milestoneSuggestions.* FROM model_plan mp, DETERMINE_MODEL_PLAN_MTO_SUGGESTIONS(mp.id) AS milestoneSuggestions
)

INSERT INTO mto_suggested_milestone (id, mto_common_milestone_key, model_plan_id, created_by)
SELECT
    GEN_RANDOM_UUID() AS id,
    milestoneSuggestions.key AS mto_common_milestone_key,
    milestoneSuggestions.model_plan_id,
    '00000001-0001-0001-0001-000000000001' AS created_by
FROM milestoneSuggestions
WHERE milestoneSuggestions.suggested = TRUE;
