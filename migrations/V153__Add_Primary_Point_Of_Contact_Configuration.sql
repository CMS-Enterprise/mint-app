ALTER TABLE possible_operational_solution_contact
  ADD COLUMN is_primary BOOLEAN DEFAULT NULL;

WITH PrimaryContacts AS (
  SELECT poc.id AS contact_id
  FROM possible_operational_solution_contact poc
         JOIN possible_operational_solution pos ON poc.possible_operational_solution_id = pos.id
  WHERE (pos.sol_key, poc.name) IN (
                                    ('ACO_OS', 'Nora Fleming'),
                                    ('APPS', 'Edgar Howard'),
                                    ('ARS', 'Chinelo Johnson'),
                                    ('BCDA', 'Nicole Pham'),
                                    ('CBOSC', 'CBOSC Team'),
                                    ('CCW', 'Velda McGhee'),
                                    ('CDX', 'Ray Lofton'),
                                    ('CMS_BOX', 'MINT Team'),
                                    ('CMS_QUALTRICS', 'MINT Team'),
                                    ('CONNECT', 'Chinelo Johnson'),
                                    ('CPI_VETTING', 'MINT Team'),
                                    ('EDFR', 'Zach Nall'),
                                    ('EFT', 'MINT Team'),
                                    ('HDR', 'Curtis Naumann'),
                                    ('HIGLAS', 'Donna Schmidt'),
                                    ('HPMS', 'MINT Team'),
                                    ('GOVDELIVERY', 'Alison Rigby'),
                                    ('GS', 'Michelle Brown'),
                                    ('INNOVATION', 'Nora Fleming'),
                                    ('IDR', 'Murari Selvakesavan'),
                                    ('IPC', 'Alyssa Larson'),
                                    ('ISP', 'Joe Pusateri'),
                                    ('LDG', 'Erin Carrillo'),
                                    ('LOI', 'Chinelo Johnson'),
                                    ('LV', 'Melanie Dang'),
                                    ('MARX', 'MINT Team'),
                                    ('MIDS', 'Jim Gerber'),
                                    ('MDM', 'Glenn Eyler'),
                                    ('OUTLOOK_MAILBOX', 'MINT Team'),
                                    ('POST_PORTAL', 'Chinelo Johnson'),
                                    ('QV', 'Whitney Saint-Fleur'),
                                    ('RFA', 'Chinelo Johnson'),
                                    ('RMADA', 'Joe Pusateri'),
                                    ('SHARED_SYSTEMS', 'Madhu Annadata')
    )
)
UPDATE possible_operational_solution_contact
SET is_primary = TRUE,
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = now()
FROM PrimaryContacts
WHERE possible_operational_solution_contact.id = PrimaryContacts.contact_id;

CREATE UNIQUE INDEX idx_unique_primary_contact_per_solution
  ON possible_operational_solution_contact (possible_operational_solution_id)
  WHERE is_primary = TRUE;
