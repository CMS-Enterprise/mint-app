/*

This can be expanded if needed. Note that the final grouping doesn't separate models first, though we could do this.
Also, we do not specifically look for ready for clearance data. It is possible, but it is more time consuming as it is not it's own section.
We are also not specifically looking at the linking a document to a solution.
 */

SELECT
    model_plan.model_name,
    tconfig.name AS table_name,
    COUNT(field.*) AS number_of_changes,
    COUNT(DISTINCT taudit.id) AS number_of_record_changes,
    CASE
        WHEN tconfig.name IN ('operational_solution', 'operational_need', 'operational_solution_subtask') THEN 'Operational Solution Implementation'
        ELSE tconfig.name::TEXT
    END AS section,
    model_plan.id
FROM model_plan
LEFT JOIN translated_audit AS taudit ON model_plan.id = taudit.model_plan_id
LEFT JOIN audit.table_config AS tconfig ON taudit.table_id = tconfig.id
LEFT JOIN translated_audit_field AS field ON taudit.id = field.translated_audit_id 
WHERE 
    (
        /* These fields are specifically excluded by request, or because they don't represent a change made by user*/
        field.field_name NOT IN
        (
            --			'ready_for_clearance_by','ready_for_clearance_dts',
            'ready_for_review_by','ready_for_review_dts','previous_suggested_phase'
        )
        /* Avoid showing status changes, as these are often automatic processes. The exception being for a model plan*/
        AND ( field.field_name != 'status' AND tconfig.name != 'model_plan')
        /* Exclude setting an operational need as needed or not, as this is often performed by trigger*/ 
        AND ( field.field_name != 'needed' AND tconfig.name != 'operational_need')
        AND ( tconfig.name IN (
            'plan_basics',
            'plan_general_characteristics',
            'plan_participants_and_providers',
            'plan_beneficiaries',
            'plan_ops_eval_and_learning',
            'operational_solution', 
            'operational_need', 
            'operational_solution_subtask'
        ))
        AND model_plan.archived != TRUE
    )

GROUP BY model_plan.model_name, 	model_plan.id, table_name
ORDER BY  model_plan.model_name ASC, number_of_changes DESC
--		ORDER BY model_name, number_of_changes DESC				
