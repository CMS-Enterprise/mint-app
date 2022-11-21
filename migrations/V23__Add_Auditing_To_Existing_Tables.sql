SELECT audit.AUDIT_TABLE('public', 'model_plan', 'id', NULL, '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{model_name, status}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_basics', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{status}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_beneficiaries', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{status}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_collaborator', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{full_name}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_discussion', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'discussion_reply', 'id', 'discussion_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_document', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_general_characteristics', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{status}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_it_tools', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_ops_eval_and_learning', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{status}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_participants_and_providers', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{status}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_payments', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{status}'::TEXT[]);

SELECT audit.AUDIT_TABLE('public', 'plan_cr_tdl', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);

--Leaving out existing_model, nda_agreement, and plan_favorite
