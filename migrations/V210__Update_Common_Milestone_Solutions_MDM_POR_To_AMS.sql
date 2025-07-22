-- Remove MDM_POR as common solution for MANAGE_PROV_OVERLAP milestone
DELETE FROM mto_common_milestone_solution_link 
WHERE
    mto_common_milestone_key = 'MANAGE_PROV_OVERLAP' 
    AND mto_common_solution_key = 'MDM_POR';

-- Remove MDM_POR as common solution for MANAGE_BEN_OVERLAP milestone  
DELETE FROM mto_common_milestone_solution_link 
WHERE
    mto_common_milestone_key = 'MANAGE_BEN_OVERLAP' 
    AND mto_common_solution_key = 'MDM_POR';

-- Add AMS as common solution for MANAGE_PROV_OVERLAP milestone
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('MANAGE_PROV_OVERLAP', 'AMS');

-- Add AMS as common solution for MANAGE_BEN_OVERLAP milestone
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('MANAGE_BEN_OVERLAP', 'AMS');
