ALTER TYPE OPERATIONAL_SOLUTION_KEY RENAME VALUE 'MDM' TO 'MDM-POR';

UPDATE possible_operational_solution
SET sol_name = 'Master Data Management Program-Organization Relationship',
    sol_key = 'MDM-POR',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = NOW()
WHERE id = 25;