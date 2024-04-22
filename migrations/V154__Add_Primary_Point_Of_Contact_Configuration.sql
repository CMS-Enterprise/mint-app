ALTER TABLE possible_operational_solution_contact
  ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT FALSE;

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


-- Partial Unique Index ensuring only one contact is set at a time
CREATE UNIQUE INDEX idx_unique_primary_contact_per_solution
  ON possible_operational_solution_contact (possible_operational_solution_id)
  WHERE is_primary = TRUE;


-- Trigger Constraint ensuring a primary contact is always set for possible operational solutions
CREATE OR REPLACE FUNCTION ensure_primary_contact()
  RETURNS TRIGGER AS $$
BEGIN
  -- Check if there is at least one primary contact for the solution
  IF NOT EXISTS (
    SELECT 1
    FROM possible_operational_solution_contact
    WHERE possible_operational_solution_id = OLD.possible_operational_solution_id
      AND is_primary = TRUE
  ) THEN
    RAISE EXCEPTION 'At least one primary contact must be assigned for each operational solution.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ensure_primary_contact
  AFTER UPDATE OR DELETE ON possible_operational_solution_contact
  FOR EACH ROW
EXECUTE FUNCTION ensure_primary_contact();
