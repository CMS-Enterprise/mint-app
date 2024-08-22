UPDATE possible_operational_solution_contact
SET
  name = 'CPI Vetting Team',
  email = 'cpi_pi_vetting@cms.hhs.gov',
  modified_by = '00000001-0001-0001-0001-000000000001', -- System account
  modified_dts = current_timestamp
WHERE
  possible_operational_solution_id = 10
