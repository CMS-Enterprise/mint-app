BEGIN;
-- Turn off constraint to require a primary contact
ALTER TABLE possible_operational_solution_contact DISABLE TRIGGER trg_ensure_primary_contact;
-- Step 1: Create a temporary table to store the primary contacts to be updated
CREATE TEMPORARY TABLE tmp_primary_contacts (
    sol_key OPERATIONAL_SOLUTION_KEY,
    contact_name TEXT,
    is_primary BOOLEAN
);

-- Insert the primary contacts into the temporary table
INSERT INTO tmp_primary_contacts (sol_key, contact_name, is_primary)
VALUES 
('INNOVATION', '4i/ACO-OS Team', TRUE),
('ACO_OS', '4i/ACO-OS Team', TRUE),
('APPS', 'Aliza Kim', TRUE),
('BCDA', 'BCDA Team', TRUE),
('GOVDELIVERY', 'Andrew Rushton', TRUE),
('GS', 'Mary Greene', TRUE),
('IPC', 'Ron Topper', TRUE),
('IDR', 'Jim Brogan', TRUE),
('LDG', 'Andrew Philip', TRUE),
('LV', 'Megan Hyde', TRUE),
('MDM', 'Celia Shaunessy', TRUE),
('MIDS', 'Dustin Allison', TRUE),
('QV', 'Susannah Bernheim', TRUE),
('ARS', 'Elia Cossis', TRUE),
('CONNECT', 'Elia Cossis', TRUE),
('LOI', 'Elia Cossis', TRUE),
('POST_PORTAL', 'Elia Cossis', TRUE),
('RFA', 'Elia Cossis', TRUE),
('SHARED_SYSTEMS', 'Donna Schmidt', TRUE);

-- Step 2: Reset current primary contacts for provided solutions to not be primary
UPDATE possible_operational_solution_contact
SET
    is_primary = FALSE,
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = NOW()
FROM possible_operational_solution AS pos
INNER JOIN tmp_primary_contacts AS tpc ON pos.sol_key = tpc.sol_key
WHERE
    possible_operational_solution_contact.possible_operational_solution_id = pos.id
    AND possible_operational_solution_contact.is_primary = TRUE;

-- Step 3: Set the new primary contacts based on the data in the temp table
UPDATE possible_operational_solution_contact
SET
    is_primary = tpc.is_primary,
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = NOW()
FROM tmp_primary_contacts AS tpc
INNER JOIN possible_operational_solution AS pos ON tpc.sol_key = pos.sol_key
WHERE
    possible_operational_solution_contact.name = tpc.contact_name
    AND possible_operational_solution_contact.possible_operational_solution_id = pos.id;

-- Clean up the temporary table
DROP TABLE tmp_primary_contacts;

-- Re-enable trigger
ALTER TABLE possible_operational_solution_contact ENABLE TRIGGER trg_ensure_primary_contact;

COMMIT;
