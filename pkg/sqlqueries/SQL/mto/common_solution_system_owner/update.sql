UPDATE mto_common_solution_system_owner
SET
    mto_common_solution_key = :mto_common_solution_key,
    owner_type = :owner_type,
    cms_component = :cms_component,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
    id,
    mto_common_solution_key,
    owner_type,
    cms_component,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
