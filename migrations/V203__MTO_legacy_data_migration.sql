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


WITH needs AS ( --noqa
    SELECT 
        need.id,
        need.model_plan_id,
        possible.need_key AS possible_need_type, --TODO, this must be translated to a common milestone type, or handled individually
        need.name_other,
        need.created_by,
        need.created_dts,
        need.modified_by,
        need.modified_dts
        
    FROM operational_need AS need 
    LEFT JOIN possible_operational_need AS possible ON need.need_type = possible.id
    WHERE need.needed = TRUE
),

solutions AS (
    SELECT 
        solution.id,
        solution.operational_need_id,
        need.model_plan_id,
        CASE 
            WHEN possible.sol_key  IN ('INTERNAL_STAFF', 'OTHER_NEW_PROCESS', 'CONTRACTOR', 'CROSS_MODEL_CONTRACT')
                THEN NULL
            ELSE possible.sol_key         
        END AS possible_solution_type, --TODO, use the data Zoë provided to map the types
        solution.name_other,
        solution.poc_email,
        solution.poc_name,
        solution.is_other,
        solution.other_header,
        solution.created_by,
        solution.created_dts,
        solution.modified_by,
        solution.modified_dts
        
    FROM operational_solution AS solution
    JOIN operational_need AS need ON solution.operational_need_id = need.id -- TODO should we disregard solutions that are for needs that are not needed? or still add any solutions that are needed? They might currently be hidden in the front end 
    LEFT JOIN possible_operational_solution AS possible ON solution.solution_type = possible.id
    WHERE solution.needed = TRUE
),

inserted_milestones AS ( --noqa
    INSERT INTO mto_milestone (
        id,
        model_plan_id,
        name,
        mto_common_milestone_key,
        status,
        created_by  --todo should we add modified and dates etc?
        
    )
    SELECT
        needs.id, --insert the same id as the operational need
        needs.model_plan_id,
        needs.name_other,
        (needs.possible_need_type::TEXT)::MTO_COMMON_MILESTONE_KEY AS common_milestone_key, --TODO, this must be translated to a common milestone type, or handled individually
        CASE
            WHEN        needs.modified_by IS NOT NULL THEN 'IN_PROGRESS'::MTO_MILESTONE_STATUS
            ELSE 'NOT_STARTED'::MTO_MILESTONE_STATUS
        END AS status,
        needs.created_by
        

    FROM needs
    RETURNING *
),
--
----SELECT * FROM needs;
--SELECT solutions.* FROM solutions
--LEFT JOIN needs ON solutions.operational_need_id = needs.id;

inserted_solutions AS ( --noqa
    INSERT INTO mto_solution (
        id,
        model_plan_id,
        name,
        mto_common_solution_key,
        poc_email,
        poc_name,
        type,
        status,
        created_by
    )
    SELECT
        s.id,
        s.model_plan_id,
        s.name_other,
        (s.possible_solution_type::TEXT)::MTO_COMMON_SOLUTION_KEY AS common_solution_key,
        CASE
            WHEN s.possible_solution_type IS NOT NULL THEN NULL --Don't add POC info for common solutions
            ELSE s.poc_email
        END AS poc_email,
        CASE
            WHEN s.possible_solution_type IS NOT NULL THEN NULL --Don't add POC info for common solutions
            ELSE s.poc_name
        END AS poc_name,
        CASE
            WHEN s.possible_solution_type IS NOT NULL THEN NULL 
            ELSE 'IT_SYSTEM'::MTO_SOLUTION_TYPE 
        END AS  type, --TODO Adjust this to try to determine what the type should be for a custom type
        CASE
            WHEN        s.modified_by IS NOT NULL THEN 'IN_PROGRESS'::MTO_SOLUTION_STATUS
            ELSE 'NOT_STARTED'::MTO_SOLUTION_STATUS
        END AS status,
        s.created_by
    FROM solutions s
    RETURNING
        mto_solution.id,
        mto_solution.created_by
        -- s.operational_need_id;
),

linkMapping AS (
    SELECT 
        inserted_milestones.id AS milestone_id,
        inserted_solutions.id AS solution_id, --noqa
        inserted_solutions.created_by
    FROM inserted_milestones
    -- We use the operational need id as the milestone id to enable easier joins and linking
    LEFT JOIN  solutions ON solutions.operational_need_id = inserted_milestones.id
    -- We use the operational_solution id as the same as the mto_solution ID, so we can join this way
    LEFT JOIN inserted_solutions ON inserted_solutions.id = solutions.id
),

insertedLinks AS (
    INSERT INTO mto_milestone_solution_link (
        milestone_id,
        solution_id,
        created_by
    )
    SELECT
        linkMapping.milestone_id,
        linkMapping.solution_id,
        linkMapping.created_by
    FROM linkMapping
    RETURNING *
)

SELECT * FROM insertedLinks
