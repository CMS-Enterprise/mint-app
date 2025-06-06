SELECT
    id,
    mto_common_solution_key,
    contractor_title,
    contractor_name,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM mto_common_solution_contractor
WHERE mto_common_solution_key = :mto_common_solution_key;