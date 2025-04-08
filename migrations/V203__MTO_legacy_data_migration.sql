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

4. Duplicate Solutions
   a. this migration will get the most recent one and insert that. It will ignore another custom solution on that model plan  with the same name.
   b. Similar to the above, if a common solution is used for two operational needs, it will only insert one record and link it to both of the new mto milestones
5. Solution Status
    a. we remove AT_RISK and set it to IN_PROGRESS.
    b. if it was AT_RISK, we set the risk indicator to AT_RISK (otherwise we set the default value.)
    c. Currently, there is no value that gets set to OFF_track


The following concepts from IT solutions are not applicable in the models to operations matrix.
   a. solution sub tasks
   b. document solution links


Note: the newly created milestones are also not categorized, and do not have facilitated by populated
**/


WITH needs AS (
    SELECT 
        need.id,
        need.model_plan_id,
        possible.need_key AS possible_need_type, -- This is later categorized into a common milestone type
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
        CASE
            WHEN solution.status = 'AT_RISK' THEN 'AT_RISK'::MTO_RISK_INDICATOR
            ELSE 'ON_TRACK'::MTO_RISK_INDICATOR
            --OFF_TRACK is not represented as a status in operational needs and solutions
        END AS risk_indicator,
        CASE
            WHEN solution.status = 'AT_RISK' THEN 'IN_PROGRESS'::MTO_SOLUTION_STATUS
            ELSE solution.status::TEXT::MTO_SOLUTION_STATUS
        END AS status,
        

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
-- --We use possible_solution type to ensure that we get a unique value for the partition by clause, so that null values are not grouped together. Otherwise, only one common solution would be inserted
-- we use the final_name instead of name other in case a treat as other solution is used
ranked_solutions AS (
    SELECT 
        solutions.*,
        ROW_NUMBER() OVER (
            PARTITION BY
                model_plan_id, 
                CASE 
                    WHEN final_name IS NULL THEN possible_solution_type::TEXT
                    ELSE final_name 
                END
            ORDER BY COALESCE(modified_dts, created_dts) DESC
        ) AS row_num,
        ARRAY_AGG(operational_need_id) OVER (
            PARTITION BY
                model_plan_id, 
                CASE 
                    WHEN final_name IS NULL THEN possible_solution_type::TEXT
                    ELSE final_name 
                END
        ) AS all_operational_need_ids
    FROM solutions
),

inserted_milestones AS ( --noqa
    INSERT INTO mto_milestone (
        id,
        model_plan_id,
        name,
        mto_common_milestone_key,
        status,
        created_by,
        created_dts,
        modified_by,
        modified_dts
        
    )
    SELECT
        needs.id, --insert the same id as the operational need
        needs.model_plan_id,
        needs.name_other,
        (needs.possible_need_type::TEXT)::MTO_COMMON_MILESTONE_KEY AS common_milestone_key, -- Cast to the common milestone key
        CASE
            WHEN        needs.modified_by IS NOT NULL THEN 'IN_PROGRESS'::MTO_MILESTONE_STATUS
            ELSE 'NOT_STARTED'::MTO_MILESTONE_STATUS
        END AS status,
        needs.created_by,
        needs.created_dts,
        needs.modified_by,
        needs.modified_dts

    FROM needs
    RETURNING *
),


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
        risk_indicator,
        needed_by,
        created_by,
        created_dts,
        modified_by,
        modified_dts
    )
    SELECT
        s.id,
        s.model_plan_id,
        s.final_name,

        (s.possible_solution_type::TEXT)::MTO_COMMON_SOLUTION_KEY AS common_solution_key,
        CASE
            WHEN s.possible_solution_type IS NOT NULL THEN NULL --Don't add POC info for common solutions
            -- If the email is unknown, add a placeholder unknown
            ELSE COALESCE( s.poc_email, 'tbd@unknown.unknown')
        END AS poc_email,
        CASE
            WHEN s.possible_solution_type IS NOT NULL THEN NULL --Don't add POC info for common solutions
            -- If the name is unknown, add a placeholder unknown
            ELSE COALESCE(s.poc_name, 'To be determined')
        END AS poc_name,
        s.type, 
        s.status,
        s.risk_indicator,
        s.needed_by,
        s.created_by,
        s.created_dts,
        s.modified_by,
        s.modified_dts
    FROM ranked_solutions s
    WHERE  s.row_num = 1 -- only insert the most recent solutions in case of duplicates. 
    RETURNING
        mto_solution.id,
        mto_solution.created_by,
        mto_solution.created_dts,
        mto_solution.modified_by,
        mto_solution.modified_dts
),

link_mapping AS (
    SELECT 
        inserted_solutions.id AS solution_id,
        inserted_solutions.created_by,
        inserted_solutions.created_dts,
        inserted_solutions.modified_by,
        inserted_solutions.modified_dts,
        -- we use the operational need id as the milestone id to enable easier joins and linking
        UNNEST(ranked_solutions.all_operational_need_ids) AS milestone_id,
        ranked_solutions.all_operational_need_ids
    FROM inserted_solutions
    JOIN ranked_solutions ON ranked_solutions.id = inserted_solutions.id
    /* Group the data as */
    GROUP BY inserted_solutions.id, inserted_solutions.created_by, inserted_solutions.created_dts, inserted_solutions.modified_by, inserted_solutions.modified_dts, ranked_solutions.all_operational_need_ids, milestone_id
),

-- this is the final insert statement that will link the solutions to the milestones
inserted_links AS (
    INSERT INTO mto_milestone_solution_link (
        milestone_id,
        solution_id,
        created_by,
        created_dts,
        modified_by,
        modified_dts
    )
    SELECT
        link_mapping.milestone_id,
        link_mapping.solution_id,
        link_mapping.created_by,
        link_mapping.created_dts,
        link_mapping.modified_by,
        link_mapping.modified_dts
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
