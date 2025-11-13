WITH primary_lookup AS (
    SELECT
        audit.change.id,
        audit.change.table_id,
        audit.change.primary_key,
        audit.change.foreign_key,
        audit.change.secondary_foreign_key,
        audit.table_config.name AS table_name,
        audit.change.action,
        audit.change.fields,
        audit.change.modified_by,
        audit.change.modified_dts,
        audit.table_config.fkey_field_secondary,
        (
            CASE
                WHEN  audit.table_config.name = 'model_plan'
                    THEN audit.change.primary_key
                WHEN audit.table_config.fkey_field = 'model_plan_id'
                    THEN audit.change.foreign_key
                WHEN audit.table_config.fkey_field = 'discussion_id'
                    THEN (SELECT plan_discussion.model_plan_id FROM plan_discussion WHERE plan_discussion.id = audit.change.foreign_key LIMIT 1)
                WHEN audit.table_config.fkey_field = 'operational_need_id'
                    THEN (SELECT operational_need.model_plan_id FROM operational_need WHERE operational_need.id = audit.change.foreign_key LIMIT 1)
                WHEN audit.table_config.fkey_field = 'solution_id'
                    THEN COALESCE(
                        -- Try mto_solution first (has direct model_plan_id)
                        (SELECT mto_solution.model_plan_id FROM mto_solution WHERE mto_solution.id = audit.change.foreign_key LIMIT 1),
                        -- Fall back to operational_solution (needs join through operational_need)
                        (SELECT opNeed.model_plan_id FROM
                            operational_need AS opNeed
                        INNER JOIN operational_solution AS opSol ON opNeed.ID = opSol.operational_need_id
                        WHERE opSol.id = audit.change.foreign_key LIMIT 1)
                    )
                WHEN audit.table_config.fkey_field = 'milestone_id'
                    THEN (SELECT mto_milestone.model_plan_id FROM mto_milestone WHERE mto_milestone.id = audit.change.foreign_key LIMIT 1)
            END
        ) AS model_plan_id
    FROM audit.change
    INNER JOIN audit.table_config ON audit.table_config.id = audit.change.table_id
    WHERE audit.change.id = :id
),

secondary_lookup AS (
    SELECT
        primary_lookup.id,
        primary_lookup.table_id,
        primary_lookup.primary_key,
        primary_lookup.foreign_key,
        primary_lookup.secondary_foreign_key,
        primary_lookup.table_name,
        primary_lookup.action,
        primary_lookup.fields,
        primary_lookup.modified_by,
        primary_lookup.modified_dts,
        primary_lookup.model_plan_id,
        (
            CASE
                WHEN primary_lookup.model_plan_id IS NOT NULL THEN NULL
                WHEN primary_lookup.fkey_field_secondary = 'solution_id' AND primary_lookup.secondary_foreign_key IS NOT NULL
                    THEN COALESCE(
                        -- Try mto_solution first (has direct model_plan_id)
                        (SELECT mto_solution.model_plan_id FROM mto_solution WHERE mto_solution.id = primary_lookup.secondary_foreign_key LIMIT 1),
                        -- Fall back to operational_solution (needs join through operational_need)
                        (SELECT opNeed.model_plan_id FROM
                            operational_need AS opNeed
                        INNER JOIN operational_solution AS opSol ON opNeed.ID = opSol.operational_need_id
                        WHERE opSol.id = primary_lookup.secondary_foreign_key LIMIT 1)
                    )
                WHEN primary_lookup.fkey_field_secondary = 'document_id' AND primary_lookup.secondary_foreign_key IS NOT NULL
                    THEN (
                        SELECT plan_document.model_plan_id FROM
                            plan_document
                        WHERE plan_document.id = primary_lookup.secondary_foreign_key LIMIT 1
                    )
                WHEN primary_lookup.fkey_field_secondary = 'current_model_plan_id' AND primary_lookup.secondary_foreign_key IS NOT NULL
                    THEN primary_lookup.secondary_foreign_key
            END
        ) AS secondary_model_plan_id
    FROM primary_lookup
)

SELECT
    id,
    table_id,
    primary_key,
    foreign_key,
    secondary_foreign_key,
    table_name,
    action,
    fields,
    modified_by,
    modified_dts,
    COALESCE(model_plan_id, secondary_model_plan_id) AS model_plan_id
FROM secondary_lookup
