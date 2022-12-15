SELECT audit.AUDIT_TABLE('public', 'plan_collaborator', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{full_name, team_role}'::TEXT[]);
