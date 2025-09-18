-- Add mto_milestone_note to the TABLE_NAME enum
ALTER TYPE TABLE_NAME ADD VALUE 'mto_milestone_note';
COMMIT;

-- Add table configuration for mto_milestone_note
INSERT INTO audit.table_config (
    schema,
    name,
    created_by_field,
    modified_by_field,
    pkey_field,
    fkey_field,
    ignored_fields,
    insert_fields,
    created_by,
    created_dts
) VALUES (
    'public',
    'mto_milestone_note',
    'created_by',
    'modified_by',
    'id',
    'mto_milestone_id',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    '00000001-0001-0001-0001-000000000001', -- System Account
    CURRENT_TIMESTAMP
);
