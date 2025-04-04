/**
This migration migrates operational solution data to mto solution data. It does the following:
1. looks at all operational needs currently set to needed for a model plan. For each operational need, a relevant mto milestone is created.
   a. A matching possible operational need results in a milestone with a matching common milestone
   b. A custom operational need results in a custom mto milestones
2. It then looks at all operational solutions for those operational needs. It will attempt to standardize the mto solutions that are inserted. 
    a. If a solution is duplicated, it will add only one record and link it to both of the new mto milestones
    b. a possible operational solution becomes a common mto solution when possible
    c. a custom operational solution becomes a custom mto solution

3.  It will then create a link between the mto milestone and the mto solution.

4. Duplicate custom solutions.
   a. this migration will get the most recent one and insert that. It will ignore another custom solution on that model plan  with the same name.



The following concepts from IT solutions are not applicable in the models to operations matrix.
   a. solution sub tasks
   b. document solution links


Note: the newly created milestones are also not categorized, and do not have facilitated by populated
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
            WHEN possible.sol_key  IN ('INTERNAL_STAFF', 'EXISTING_CMS_DATA_AND_PROCESS', 'OTHER_NEW_PROCESS', 'CONTRACTOR', 'CROSS_MODEL_CONTRACT')
                THEN NULL
            ELSE possible.sol_key         
        END AS possible_solution_type,
        possible.sol_key AS raw_possible_solution_type,
        CASE
            WHEN possible.sol_key = 'CONTRACTOR'
                THEN 'Contractor: ' || COALESCE(solution.other_header, '')
            WHEN possible.sol_key = 'CROSS_MODEL_CONTRACT'
                THEN 'Cross model contract: ' || COALESCE(solution.other_header, '')
            WHEN possible.sol_key = 'OTHER_NEW_PROCESS'
                THEN 'Other new process: ' || COALESCE(solution.other_header, '')
            WHEN possible.sol_key = 'EXISTING_CMS_DATA_AND_PROCESS'
                THEN 'Existing CMS data and process: ' || COALESCE(solution.other_header, '')
            WHEN possible.sol_key = 'INTERNAL_STAFF'
                THEN 'Internal staff: ' || COALESCE(solution.other_header, '')
            ELSE solution.name_other
        END AS final_name,
        CASE 
            -- This is for old types that become custom types for MTO
            WHEN possible.sol_key  IN ('INTERNAL_STAFF', 'EXISTING_CMS_DATA_AND_PROCESS', 'OTHER_NEW_PROCESS')
                THEN 'OTHER'::MTO_SOLUTION_TYPE
            WHEN possible.sol_key  IN ('CONTRACTOR', 'CROSS_MODEL_CONTRACT')
                THEN 'CONTRACTOR'::MTO_SOLUTION_TYPE
            -- Custom operational solutions become other
            WHEN possible.sol_key IS  NULL
                THEN 'OTHER'::MTO_SOLUTION_TYPE
            -- Any other defined type get mapped based on the mto common solution type, so set null here
            ELSE  NULL 
        END AS type,
        solution.name_other,
        solution.poc_email,
        solution.poc_name,
        solution.is_other,
        solution.other_header,
        solution.must_finish_dts AS needed_by,
        solution.created_by,
        solution.created_dts,
        solution.modified_by,
        solution.modified_dts
        
    FROM operational_solution AS solution
    JOIN operational_need AS need ON solution.operational_need_id = need.id 
    LEFT JOIN possible_operational_solution AS possible ON solution.solution_type = possible.id
    WHERE solution.needed = TRUE AND need.needed = TRUE -- A solution must be needed itself, and the parent need it's associated with must be needed in order to be inserted
),

--the partition by logic should get the most recently updated row as the standard row in the case of duplicates. Use this to only insert ones where row_num =1, but links should unnest the all_operational_need_ids property
-- --We use gen_random_uuid to ensure that we get a unique value for the partition by clause, so that null values are not grouped together. Otherwise, only one common solution would be inserted
-- we use the final_name instead of name other in case a treat as other solution is used
ranked_solutions AS (
    SELECT 
        solutions.*,
        ROW_NUMBER() OVER (
            PARTITION BY
                model_plan_id, 
                CASE 
                    WHEN final_name IS NULL THEN GEN_RANDOM_UUID()::TEXT 
                    ELSE final_name 
                END
            ORDER BY COALESCE(modified_dts, created_dts) DESC
        ) AS row_num,
        ARRAY_AGG(operational_need_id) OVER (
            PARTITION BY
                model_plan_id, 
                CASE 
                    WHEN final_name IS NULL THEN GEN_RANDOM_UUID()::TEXT 
                    ELSE final_name 
                END
        ) AS all_operational_need_ids
    FROM solutions
),
--   SELECT * FROM ranked_solutions WHERE row_num = 1;

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
        -- Update, I don't think this matters as the keys match for operational needs to milestones
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
--SELECT * FROM ranked_solutions WHERE row_num = 1;
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
        needed_by,
        created_by
    )
    SELECT
        s.id,
        s.model_plan_id,
        s.final_name,

        (s.possible_solution_type::TEXT)::MTO_COMMON_SOLUTION_KEY AS common_solution_key,
        CASE
            WHEN s.possible_solution_type IS NOT NULL THEN NULL --Don't add POC info for common solutions
            ELSE s.poc_email
        END AS poc_email,
        CASE
            WHEN s.possible_solution_type IS NOT NULL THEN NULL --Don't add POC info for common solutions
            ELSE s.poc_name
        END AS poc_name,
        s.type, 
        CASE
            WHEN        s.modified_by IS NOT NULL THEN 'IN_PROGRESS'::MTO_SOLUTION_STATUS
            ELSE 'NOT_STARTED'::MTO_SOLUTION_STATUS
        END AS status,
        s.needed_by,
        s.created_by
    FROM ranked_solutions s
    WHERE  s.row_num = 1 -- only insert the most recent solutions in case of duplicates
    RETURNING
        mto_solution.id,
        mto_solution.created_by
        -- s.operational_need_id;
),
-- Adjust this, we also need to see if there are any duplicate solutions that must be addressed

link_mapping AS (
    SELECT 
        inserted_solutions.id AS solution_id, --noqa
        inserted_solutions.created_by,
        -- we use the operational need id as the milestone id to enable easier joins and linking
        UNNEST(ranked_solutions.all_operational_need_ids) AS milestone_id,
        ranked_solutions.all_operational_need_ids
    FROM inserted_solutions
    JOIN ranked_solutions ON ranked_solutions.id = inserted_solutions.id
    /* Group the data as */
    GROUP BY inserted_solutions.id, inserted_solutions.created_by, ranked_solutions.all_operational_need_ids, milestone_id
),
-- SELECT * FROM link_mapping

inserted_links AS (
    INSERT INTO mto_milestone_solution_link (
        milestone_id,
        solution_id,
        created_by
    )
    SELECT
        link_mapping.milestone_id,
        link_mapping.solution_id,
        link_mapping.created_by
    FROM link_mapping
    WHERE link_mapping.milestone_id IS NOT NULL AND link_mapping.solution_id IS NOT NULL
    RETURNING *
)


SELECT * FROM inserted_links
--SELECT * FROM link_mapping
/*
DELETE FROM mto_milestone_solution_link;
DELETE FROM mto_milestone;
DELETE FROM mto_solution;
*/
