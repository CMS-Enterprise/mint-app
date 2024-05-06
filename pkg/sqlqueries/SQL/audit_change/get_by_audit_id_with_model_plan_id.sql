SELECT
    audit.change.id,
    audit.change.table_id,
    audit.change.primary_key,
    audit.change.foreign_key,
    audit.table_config.name AS table_name,
    audit.change.action,
    audit.change.fields,
    audit.change.modified_by,
    audit.change.modified_dts,
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
                THEN (
                    SELECT opNeed.model_plan_id FROM
                        operational_need AS opNeed
                    INNER JOIN operational_solution AS opSol ON opNeed.ID = opSol.operational_need_id
                    WHERE opSol.id = audit.change.foreign_key LIMIT 1
                )
        END
    ) AS model_plan_id
    
FROM audit.change
INNER JOIN audit.table_config ON audit.table_config.id = audit.change.table_id
WHERE audit.change.id = :id
