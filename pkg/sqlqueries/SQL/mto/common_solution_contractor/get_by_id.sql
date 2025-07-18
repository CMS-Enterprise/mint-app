SELECT
    mto_common_solution_contractor.id,
    mto_common_solution_contractor.mto_common_solution_key,
    mto_common_solution_contractor.contract_title,
    mto_common_solution_contractor.contractor_name,
    mto_common_solution_contractor.created_by,
    mto_common_solution_contractor.created_dts,
    mto_common_solution_contractor.modified_by,
    mto_common_solution_contractor.modified_dts
FROM mto_common_solution_contractor
WHERE  mto_common_solution_contractor.id = :id;
