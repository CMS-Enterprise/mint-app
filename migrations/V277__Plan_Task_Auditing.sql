ALTER TYPE TABLE_NAME ADD VALUE 'plan_task';
COMMIT;

SELECT audit.AUDIT_TABLE('public', 'plan_task', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{status}'::TEXT[]);
