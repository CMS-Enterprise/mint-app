DELETE FROM mto_common_solution_contractor
WHERE id = :id
RETURNING
    id,
    mto_common_solution_key,
    contract_title,
    contractor_name,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
