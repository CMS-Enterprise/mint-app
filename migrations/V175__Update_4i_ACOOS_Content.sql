-- Note: possible operational solutions are mapped by ID to keep things simple.
--       ______________________________________
--       | ID | Possible Operational Solution |
--       |----|-------------------------------|
--       | 1  | 4i                            |
--       | 2  | ACO-OS                        |
--       --------------------------------------

UPDATE possible_operational_solution_contact
SET
  role = 'CMMI/BSG Subject Matter Expert',
  modified_by = '00000001-0001-0001-0001-000000000001', -- System account
  modified_dts = current_timestamp
WHERE
  email = 'ashley.corbin@cms.hhs.gov' AND
  (possible_operational_solution_id = 1 OR possible_operational_solution_id = 2);

UPDATE possible_operational_solution_contact
SET
  role = 'Experienced point of contact (supported use of ACO-OS with multiple models)',
  modified_by = '00000001-0001-0001-0001-000000000001', -- System account
  modified_dts = current_timestamp
WHERE
  email = 'john.lumpkin@cms.hhs.gov' AND
  possible_operational_solution_id = 2;
