SELECT
    id,
    mto_common_solution_key,
    owner_type,
    cms_component,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM mto_common_solution_system_owner
WHERE id = :id;
