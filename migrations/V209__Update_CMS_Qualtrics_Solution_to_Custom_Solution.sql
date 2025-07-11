UPDATE mto_solution AS solution
SET 
    mto_common_solution_key = NULL,
    name = 'CMS QUALTRICS',
    type = 'IT_SYSTEM',
    modified_by = '00000001-0001-0001-0001-000000000001', -- System Account
    modified_dts = CURRENT_TIMESTAMP,
    poc_name = contact.name,
    poc_email = contact.email
FROM mto_common_solution_contact AS contact
WHERE
    solution.mto_common_solution_key = contact.mto_common_solution_key
    AND solution.mto_common_solution_key = 'CMS_QUALTRICS';
