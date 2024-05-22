UPDATE audit.table_config
SET 
    insert_fields = '{*}',
    modified_by = '00000001-0001-0001-0001-000000000001', -- system account
    modified_dts = CURRENT_TIMESTAMP


WHERE name IN (
    'plan_discussion',
    'discussion_reply',
    'plan_document',
    'existing_model_link',
    'plan_document_solution_link',
    'operational_solution_subtask',
    'operational_solution',
    'operational_need',
    'plan_cr',
    'plan_tdl',
    'plan_collaborator'
);

UPDATE audit.table_config
SET 
    insert_fields = '{*,solution_id}', -- insert solution_id even though it is a foreign key
    modified_by = '00000001-0001-0001-0001-000000000001', -- system account
    modified_dts = CURRENT_TIMESTAMP


WHERE name IN (
    'plan_document_solution_link'
);

/* remove it_tools table config as the table no longer exists*/
DELETE FROM audit.table_config WHERE name = 'plan_it_tools';
