SELECT audit.AUDIT_TABLE('public', 'mto_category', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]);
SELECT audit.AUDIT_TABLE('public', 'mto_milestone', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]);
SELECT audit.AUDIT_TABLE('public', 'mto_solution', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]);
SELECT audit.AUDIT_TABLE('public', 'mto_milestone_solution_link', 'id', 'milestone_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]);
SELECT audit.AUDIT_TABLE('public', 'mto_info', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);


SELECT audit.AUDIT_TABLE('public', 'mto_common_solution_contact', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]);
