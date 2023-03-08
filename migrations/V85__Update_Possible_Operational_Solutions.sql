/* delete all operational solutions */
DELETE FROM operational_solution;

/* DROP existing LINKS */

DELETE FROM possible_need_solution_link;

/* DROP existing operational solutions */
DELETE FROM possible_operational_solution;


/* Include the new column for the possible operational solution */
ALTER TABLE possible_operational_solution
ADD COLUMN treat_as_other BOOLEAN NOT NULL DEFAULT FALSE;


/* TODO: update the solution keys to the new values. TODO! function CREATE_POSSIBLE_NEED_SOLULTION_LINK uses this, might need to change */
ALTER TABLE possible_operational_solution
ALTER COLUMN sol_key TYPE TEXT;

DROP FUNCTION create_possible_need_solultion_link;

DROP TYPE OPERATIONAL_SOLUTION_KEY;
CREATE TYPE OPERATIONAL_SOLUTION_KEY AS ENUM (
    'INNOVATION',
    'ACO_OS',
    'APPS',
    'CDX',
    'CCW',
    'CMS_BOX',
    'CMS_QUALTRICS',
    'CBOSC',
    'CONTRACTOR',
    'CPI_VETTING',
    'CROSS_MODEL_CONTRACT',
    'EFT',
    'EXISTING_CMS_DATA_AND_PROCESS',
    'EDFR',
    'GOVDELIVERY',
    'GS',
    'HDR',
    'HPMS',
    'HIGLAS',
    'IPC',
    'IDR',
    'INTERNAL_STAFF',
    'LDG',
    'LV',
    'MDM',
    'MARX',
    'OTHER_NEW_PROCESS',
    'OUTLOOK_MAILBOX',
    'QV',
    'RMADA',
    'ARS',
    'CONNECT',
    'LOI',
    'POST_PORTAL',
    'RFA',
    'SHARED_SYSTEMS'
);

ALTER TABLE possible_operational_solution
ALTER COLUMN sol_key TYPE OPERATIONAL_SOLUTION_KEY
USING (sol_key::OPERATIONAL_SOLUTION_KEY);


/* Insert the new Solutions */

INSERT INTO "public"."possible_operational_solution"("id", "sol_name", "sol_key", "treat_as_other", "created_by") VALUES
(1, '4innovation (4i)', 'INNOVATION', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(2, 'Accountable Care Organization - Operational System (ACO-OS)', 'ACO_OS', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(3, 'Automated Plan Payment System (APPS)', 'APPS', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(4, 'Centralized Data Exchange (CDX)', 'CDX', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(5, 'Chronic Conditions Warehouse (CCW)', 'CCW', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(6, 'CMS Box', 'CMS_BOX', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(7, 'CMS Qualtrics', 'CMS_QUALTRICS', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(8, 'Consolidated Business Operations Support Center (CBOSC)', 'CBOSC', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(9, 'Contractor', 'CONTRACTOR', 'TRUE', '00000001-0001-0001-0001-000000000001'),
(10, 'CPI Vetting', 'CPI_VETTING', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(11, 'Cross-model contract', 'CROSS_MODEL_CONTRACT', 'TRUE', '00000001-0001-0001-0001-000000000001'),
(12, 'Electronic File Transfer (EFT)', 'EFT', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(13, 'Existing CMS data and process', 'EXISTING_CMS_DATA_AND_PROCESS', 'TRUE', '00000001-0001-0001-0001-000000000001'),
(14, 'Expanded Data Feedback Reporting (eDFR)', 'EDFR', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(15, 'GovDelivery', 'GOVDELIVERY', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(16, 'GrantSolutions', 'GS', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(17, 'Health Data Reporting (HDR)', 'HDR', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(18, 'Health Plan Management System (HPMS)', 'HPMS', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(19, 'Healthcare Integrated General Ledger Accounting System (HIGLAS)', 'HIGLAS', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(20, 'Innovation Payment Contractor (IPC)', 'IPC', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(21, 'Integrated Data Repository (IDR)', 'IDR', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(22, 'Internal staff', 'INTERNAL_STAFF', 'TRUE', '00000001-0001-0001-0001-000000000001'),
(23, 'Learning and Diffusion Group (LDG)', 'LDG', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(24, 'Legal Vertical (LV)', 'LV', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(25, 'Master Data Management (MDM)', 'MDM', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(26, 'Medicare Advantage Prescription Drug System (MARx)', 'MARX', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(27, 'Other new process', 'OTHER_NEW_PROCESS', 'TRUE', '00000001-0001-0001-0001-000000000001'),
(28, 'Outlook Mailbox', 'OUTLOOK_MAILBOX', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(29, 'Quality Vertical (QV)', 'QV', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(30, 'Research, Measurement, Assessment, Design, and Analysis (RMADA)', 'RMADA', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(31, 'Salesforce Application Review and Scoring (ARS)', 'ARS', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(32, 'Salesforce Connect', 'CONNECT', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(33, 'Salesforce Letter of Intent (LOI)', 'LOI', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(34, 'Salesforce Project Officer Support Tool / Portal (POST/PORTAL)', 'POST_PORTAL', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(35, 'Salesforce Request for Application (RFA)', 'RFA', 'FALSE', '00000001-0001-0001-0001-000000000001'),
(36, 'Shared Systems', 'SHARED_SYSTEMS', 'FALSE', '00000001-0001-0001-0001-000000000001');
