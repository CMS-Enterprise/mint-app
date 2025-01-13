/**
This migration migrates operational solution data to mto solution data. It does the following:
1. looks at all operational needs currently set to needed for a model plan. For each operational need, a relevant mto milestone is created.
   a. A matching possible operational need results in a milestone with a matching common milestone
   b. A custom operational need results in a custom mto milestons
2. It then looks at all operational solutions for those operational needs. It will attempt to standardize the mto solutions that are inserted. 
    a. If a solution is duplicated, it will add only one record and link it to both of the new mto milestones
    b. a possible operational solution becomes a common mto solution when possible
    c. a custom operational solution becomes a custom mto solution

3. The following concepts from IT solutions are not applicable in the models to operations matrix.
   a. solution sub tasks
   b. document solution links
**/


WITH needs AS (
    SELECT 
        need.id,
        need.model_plan_id,
        possible.need_key AS possible_need_type,
        need.name_other
        
    FROM operational_need AS need 
    LEFT JOIN possible_operational_need AS possible ON need.need_type = possible.id
    WHERE need.needed = TRUE
),

solutions AS (
    SELECT 
        solution.operational_need_id,
        need.model_plan_id,
        possible.sol_key AS possible_solution_type,
        solution.name_other,
        solution.is_other,
        solution.other_header
        
    FROM operational_solution AS solution
    JOIN operational_need AS need ON solution.operational_need_id = need.id -- TODO should we disregard solutions that are for needs that are not needed? or still add any solutions that are needed? They might currently be hidden in the front end 
    LEFT JOIN possible_operational_solution AS possible ON solution.solution_type = possible.id
    WHERE solution.needed = TRUE
)


--SELECT * FROM needs;
SELECT solutions.* FROM solutions
LEFT JOIN needs ON solutions.operational_need_id = needs.id;
