CREATE TYPE model_category AS ENUM (
	'Accountable Care',
	'Demonstration',
	'Episode-based Payment Initiatives',
	'Initiatives Focused on the Medicaid and CHIP Population',
	'Initiatives Focused on the Medicare and Medicaid Enrollees',
	'Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models', --Too big
	'Initiatives to Speed the Adoption of Best Practices',
	'Primary Care Transformation',
	'TBD'
);
CREATE TYPE cms_center AS ENUM (
	'CMMI',
	'Center for Medicare (CM)',
	'Federal Coordinated Health Care Office',
	'Center for Clinical Standards and Quality',
	'Center for Program Integrity',
	'Other (please specify)'
);
CREATE TYPE cmmi_group as ENUM (
	'Patient Care Models Group (PCMG)',
	'Policy and Programs Group (PPG)',
	'Preventive and Population Health Care Models Group (PPHCMG)',
	'Seamless Care Models Group (SCMG)',
	'State Innovations Group (SIG)',
	'Unknown/Unassigned or TBD?'
);
CREATE TYPE model_type as ENUM ('Voluntary', 'Mandatory', 'TBD');
CREATE TYPE tri_state_answer as ENUM ('Yes', 'No', 'TBD');