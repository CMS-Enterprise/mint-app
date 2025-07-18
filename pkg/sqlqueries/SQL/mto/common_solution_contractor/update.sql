UPDATE mto_common_solution_contractor
SET
    mto_common_solution_key = :mto_common_solution_key,
    contract_title = :contract_title,
    contractor_name = :contractor_name,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
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
