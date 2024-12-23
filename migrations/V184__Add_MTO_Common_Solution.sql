CREATE TYPE MTO_COMMON_SOLUTION_KEY AS ENUM (
    'INNOVATION',
    'ACO_OS',
    'APPS',
    'CDX',
    'CCW',
    'CMS_BOX',
    'CMS_QUALTRICS',
    'CBOSC',
    'CPI_VETTING',
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
    'LDG',
    'LV',
    'MDM_POR',
    'MARX',
    'OUTLOOK_MAILBOX',
    'QV',
    'RMADA',
    'ARS',
    'CONNECT',
    'LOI',
    'POST_PORTAL',
    'RFA',
    'SHARED_SYSTEMS',
    'BCDA',
    'ISP',
    'MIDS',
    'MDM_NCBP',
    'MODEL_SPACE'
);

COMMENT ON TYPE MTO_COMMON_SOLUTION_KEY IS 'These keys represent all the various options available for an mto solution. They are configured in mto_common_solution table and referenced in mto_solution';

CREATE TYPE MTO_SOLUTION_TYPE AS ENUM (
    'IT_SYSTEM',
    'CONTRACTOR',
    'CROSS_CUTTING_GROUP',
    'OTHER'
);
COMMENT ON TYPE MTO_SOLUTION_TYPE IS
'Specifies the type of solution, such as IT system, contract, cross-cutting group, or other, to categorize solutions used within the model plan.';


CREATE TYPE MTO_COMMON_SOLUTION_SUBJECT AS ENUM (
    'APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS',
    'APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS',
    'MEDICARE_FEE_FOR_SERVICE',
    'CONTRACT_VEHICLES',
    'LEARNING',
    'QUALITY',
    'COMMUNICATION_TOOLS_AND_HELP_DESK',
    'MEDICARE_ADVANTAGE_AND_PART_D',
    'PAYMENTS_AND_FINANCIALS',
    'DATA',
    'LEGAL'
);

COMMENT ON TYPE MTO_COMMON_SOLUTION_SUBJECT IS
'Specifies the type of subjects, that an mto common solution can possibly be in regard to.';


CREATE TABLE mto_common_solution (
    key MTO_COMMON_SOLUTION_KEY PRIMARY KEY,
    name ZERO_STRING NOT NULL,
    type MTO_SOLUTION_TYPE NOT NULL,
    subjects MTO_COMMON_SOLUTION_SUBJECT[] NOT NULL,
    filter_view MODEL_VIEW_FILTER
);

COMMENT ON TABLE mto_common_solution IS 'Table for storing common solutions configurations for the models to operations matrix';

COMMENT ON COLUMN mto_common_solution.key IS 'Primary key representing a unique identifier for the common solution.';
COMMENT ON COLUMN mto_common_solution.name IS 'Name of the common solution; must be a non-empty string.';
COMMENT ON COLUMN mto_common_solution.type IS 'Type of the solution, represented as an MTO_SOLUTION_TYPE enum.';
COMMENT ON COLUMN mto_common_solution.subjects IS 'Array of subjects associated with the solution, using the MTO_COMMON_SOLUTION_SUBJECT type.';
COMMENT ON COLUMN mto_common_solution.filter_view IS 'Optional field defining a filter view, using the MODEL_VIEW_FILTER type. This is primarily used for sending notifications when a solution is selected';
