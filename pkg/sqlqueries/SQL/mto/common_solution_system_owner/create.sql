INSERT INTO mto_common_solution_system_owner (
    id,
    mto_common_solution_key,
    owner_type,
    cms_component,
    created_by,
    created_dts,
    modified_by,
    modified_dts
) VALUES (
    :id,
    :mto_common_solution_key,
    :owner_type,
    :cms_component,
    :created_by,
    :created_dts,
    :modified_by,
    :modified_dts
)
RETURNING
    id,
    mto_common_solution_key,
    owner_type,
    cms_component,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
