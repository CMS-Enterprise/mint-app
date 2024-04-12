ALTER TABLE possible_operational_solution_contact
  ADD COLUMN is_primary BOOLEAN default null;

CREATE UNIQUE INDEX idx_unique_primary_contact_per_solution
  ON possible_operational_solution_contact (possible_operational_solution_id)
  WHERE is_primary = TRUE;

-- Add a boolean column to the table possible_operational_solution_contact to indicate if the contact is the primary contact for the operational solution
UPDATE possible_operational_solution_contact
SET is_primary = true,
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = now()

WHERE (name, possible_operational_solution_id) IN (
                                                   -- Applications and Participant Interaction (ACO and kidney models)
                                                   ('Chinelo Johnson', 33), -- LOI
                                                   ('Chinelo Johnson', 35), -- RFA
                                                   ('Chinelo Johnson', 31), -- ARS
                                                   ('MINT Team', 7), -- CMS_QUALTRICS
                                                   ('MINT Team', 10), -- CPI_VETTING
                                                   ('Nora Fleming', 1), -- 4i
                                                   ('Nora Fleming', 2), -- ACO-OS
                                                   ('Nicole Pham', 37), -- BCDA

                                                   -- Applications and Participant Interaction (Non-ACO Models)
                                                   ('Michelle Brown', 16), -- GS
                                                   ('Joe Pusateri', 38), -- ISP
                                                   ('Chinelo Johnson', 34), -- POST_PORTAL

                                                   -- Communication Tools
                                                   ('MINT Team', 6), -- CMS_BOX
                                                   ('MINT Team', 12), -- EFT
                                                   ('Alison Rigby', 15), -- GOVDELIVERY
                                                   ('MINT Team', 28), -- OUTLOOK_MAILBOX
                                                   ('CBOSC Team', 8), -- CBOSC

                                                   -- Contract vehicles
                                                   ('Alyssa Larson', 20), -- IPC
                                                   -- ISP: See entry in Applications and Participant Interaction (Non-ACO Models) section
                                                   ('Jim Gerber', 39), -- MIDS
                                                   ('Joe Pusateri', 30), -- RMADA

                                                   -- Data
                                                   ('Ray Lofton', 4), -- CDX
                                                   ('Velda McGhee', 5), -- CCW
                                                   ('Zach Nall', 14), -- EDFR
                                                   ('Curtis Naumann', 17), -- HDR
                                                   ('Murari Selvakesavan', 21), -- IDR
                                                   ('Glenn Eyler', 25), -- MDM

                                                   -- Learning
                                                   ('Erin Carrillo', 23), -- LDG
                                                   ('Chinelo Johnson', 32), -- CONNECT

                                                   -- Legal
                                                   ('Melanie Dang', 24), -- LV

                                                   -- Medicare Advantage and Part D
                                                   ('Edgar Howard', 3), -- APPS
                                                   ('MINT Team', 18), -- HPMS
                                                   ('MINT Team', 26), -- MARX

                                                   -- Medicare Fee-for-Service
                                                   ('Madhu Annadata', 36), -- SHARED_SYSTEMS

                                                   -- Payments and financials
                                                   ('Donna Schmidt', 19), -- HIGLAS
                                                   -- IPC: See entry in Contract Vehicles section

                                                   -- Quality
                                                   -- HDR: See entry in Data section
                                                   -- MIDS: See entry in Contract Vehicles section
                                                   ('Whitney Saint-Fleur', 29)); -- QV
