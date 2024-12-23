UPDATE possible_operational_solution_contact
SET
  role = 'CMMI/BSG Point of Contact',
  name = 'Sara Fontaine',
  email = 'sara.fontaine1@cms.hhs.gov',
  is_team = false,
  modified_by = '00000001-0001-0001-0001-000000000001', -- System account
  modified_dts = current_timestamp
WHERE
  name in ('Bobbie Knickman', 'Barbara Rufo', 'Celia Shaunessy');
