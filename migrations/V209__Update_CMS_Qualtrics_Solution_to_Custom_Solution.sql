UPDATE mto_solution 
SET
    mto_common_solution_key = NULL,
    name = 'CMS QUALTRICS',
    type = 'IT_SYSTEM',
    poc_name = 'MINT Team',
    poc_email = 'MINTTeam@cms.hhs.gov',
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts= CURRENT_TIMESTAMP
WHERE mto_common_solution_key = 'CMS_QUALTRICS';
