-- Changes: (Job) UPDATE THIS SQL TO return the audit by audit_id
WITH PLAN AS (
    SELECT 
        id AS id,
        id AS model_plan_id,
        'model_plan_id' AS fk_field
    FROM model_plan WHERE id = :model_plan_id
),

DISCUSSION AS ( 
    SELECT 
        PLAN.id AS model_plan_id,
        discussion.id AS id,
        'discussion_id' AS fk_field
    FROM PLAN

    INNER JOIN plan_discussion AS discussion ON PLAN.id = discussion.model_plan_id
),
	
NEED AS ( 
    SELECT 
        PLAN.id AS model_plan_id,
        OpNd.id AS id,
        'operational_need_id' AS fk_field
    FROM PLAN

    INNER JOIN operational_need AS OpNd ON PLAN.id = OpNd.model_plan_id
),

SOLUTION AS (
    SELECT
        NEED.model_plan_id AS model_plan_id,
        OpSol.id AS id,
        'solution_id' AS fk_field
    FROM NEED	
    INNER JOIN operational_solution AS OpSol ON NEED.id = OpSol.operational_need_id 
),

FIELDS AS (
    SELECT
        id,
        fk_field,
        model_plan_id
    FROM PLAN
    UNION
    SELECT
        id,
        fk_field,
        model_plan_id
    FROM DISCUSSION
    UNION
    SELECT
        id,
        fk_field,
        model_plan_id
    FROM NEED
    UNION
    SELECT
        id,
        fk_field,
        model_plan_id
    FROM SOLUTION
)

SELECT
    audit.change.id,
    audit.change.table_id,
    audit.change.primary_key,
    audit.change.foreign_key,
    audit.table_config.name AS table_name,
    audit.change.action,
    audit.change.fields,
    audit.change.modified_by,
    audit.change.modified_dts
FROM audit.change
INNER JOIN audit.table_config ON audit.table_config.id = audit.change.table_id
INNER JOIN FIELDS ON (FIELDS.fk_field = audit.table_config.fkey_field AND FIELDS.id = audit.change.foreign_key)
WHERE
    audit.change.modified_dts >= :time_start AND audit.change.modified_dts < :time_end
UNION
SELECT --This selects changes for the model plan
    audit.change.id,
    audit.change.table_id,
    audit.change.primary_key,
    audit.change.foreign_key,
    audit.table_config.name AS table_name,
    audit.change.action,
    audit.change.fields,
    audit.change.modified_by,
    audit.change.modified_dts
FROM audit.change
INNER JOIN audit.table_config ON audit.table_config.id = audit.change.table_id
WHERE
    (audit.change.primary_key = (SELECT id FROM PLAN) AND audit.table_config.name = 'model_plan') 
    -- Changes (ChChCh Changes!) Perhaps using the provided variable instead of selecting from a CTE?
    AND audit.change.modified_dts >= :time_start AND audit.change.modified_dts < :time_end
