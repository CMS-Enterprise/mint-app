-- TURN off constraint to require a primary contact
ALTER TABLE possible_operational_solution_contact DISABLE TRIGGER trg_ensure_primary_contact;

-- ALTER TABLE possible_operational_solution_contact DROP CONSTRAINT idx_unique_primary_contact_per_solution;
DROP INDEX idx_unique_primary_contact_per_solution;


WITH PrimaryContacts AS (
    SELECT
        'INNOVATION'AS sol_key,
        '4i/ACO-OS Team' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'ACO_OS' AS sol_key,
        '4i/ACO-OS Team' AS contact_name,
        TRUE  AS is_primary 
    UNION
    SELECT 
        'APPS' AS sol_key,
        'Aliza Kim' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'BCDA' AS sol_key,
        'BCDA Team' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'GOVDELIVERY' AS sol_key,
        'Andrew Rushton' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'GS' AS sol_key,
        'Mary Greene' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'IPC' AS sol_key,
        'Ron Topper' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'IDR' AS sol_key,
        'Jim Brogan' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'LDG' AS sol_key,
        'Andrew Philip' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'LV' AS sol_key,
        'Megan Hyde' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'MDM' AS sol_key,
        'Celia Shaunessy' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'MIDS' AS sol_key,
        'Dustin Allison' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'QV' AS sol_key,
        'Susannah Bernheim' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'ARS' AS sol_key,
        'Elia Cossis' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'CONNECT' AS sol_key,
        'Elia Cossis' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'LOI' AS sol_key,
        'Elia Cossis' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'POST_PORTAL' AS sol_key,
        'Elia Cossis' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'RFA' AS sol_key,
        'Elia Cossis' AS contact_name,
        TRUE AS is_primary 
    UNION
    SELECT 
        'SHARED_SYSTEMS' AS sol_key,
        'Donna Schmidt' AS contact_name,
        TRUE AS is_primary 

),

removedPOCs AS (
-- Remove current primary points of contacts, set them as not primary
    UPDATE possible_operational_solution_contact
    SET
        is_primary = FALSE,
        modified_by = '00000001-0001-0001-0001-000000000001',
        modified_dts = now()
    FROM PrimaryContacts AS pc
    INNER JOIN possible_operational_solution AS pos ON pos.sol_key::TEXT = pc.sol_key
    INNER JOIN possible_operational_solution_contact AS poc ON pos.sol_key::TEXT = pc.sol_key AND poc.is_primary = TRUE
),

primaryContactWithSol AS (
-- Get possible solution information for the provided contacts
    SELECT
        pc.contact_name,
        pc.is_primary,
        pc.sol_key,
        pos.id AS solution_id,
        '00000001-0001-0001-0001-000000000001' AS modified_by,
        now() AS modified_dts
    FROM PrimaryContacts AS pc
    INNER JOIN possible_operational_solution AS pos ON pos.sol_key = pc.sol_key::OPERATIONAL_SOLUTION_KEY
)

-- set the provided contacts as primary contacts
UPDATE possible_operational_solution_contact
SET
    is_primary = pc.is_primary,
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = now()
FROM primaryContactWithSol AS pc
WHERE possible_operational_solution_contact.name = pc.contact_name AND possible_operational_solution_contact.possible_operational_solution_id = pc.solution_id;

ALTER TABLE possible_operational_solution_contact ENABLE TRIGGER trg_ensure_primary_contact;

-- Partial Unique Index ensuring only one contact is set at a time
CREATE UNIQUE INDEX idx_unique_primary_contact_per_solution
ON possible_operational_solution_contact (possible_operational_solution_id)
WHERE is_primary = TRUE;
