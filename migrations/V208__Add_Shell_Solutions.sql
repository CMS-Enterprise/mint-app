-- Add Additional Solutions to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'RREG';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'FFRDC';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'ARDS';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'T_MISS';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'EPPE';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'DSEP';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'AMS';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'IC_LANDING';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'RASS';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'DDPS';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'OACT';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'QPP';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'PAM';

-- Add additional solution category to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_SUBJECT ADD VALUE 'EVALUATION_AND_REVIEW';

COMMIT;

-- Insert solutions into the mto common solution table
INSERT INTO mto_common_solution("key", "name", "type", "subjects") VALUES
('RREG', 'Research and Rapid Cycle Evaluation Group (RREG)', 'CROSS_CUTTING_GROUP', '{EVALUATION_AND_REVIEW}'),
('FFRDC', 'Federally Funded Research and Development Center (FFRDC)', 'CONTRACTOR', '{CONTRACT_VEHICLES}'),
('ARDS', 'Actuarial Research and Design Services (ARDS)', 'CONTRACTOR', '{CONTRACT_VEHICLES}'),
('T_MISS', 'Transformed Medicaid Statistical Information System (T_MISS)', 'IT_SYSTEM', '{DATA}'),
('EPPE', 'Enterprise Privacy Policy Engine Cloud (EPPE)', 'OTHER', '{COMMUNICATION_TOOLS_AND_HELP_DESK}'),
('DSEP', 'Division of Stakeholder Engagement and Policy (DSEP)', 'OTHER', '{COMMUNICATION_TOOLS_AND_HELP_DESK}'),
('AMS', 'CMMI Analysis and Management System (AMS)', 'IT_SYSTEM', '{DATA}'),
('IC_LANDING', 'Innovation Center Landing Page (IC_LANDING)', 'IT_SYSTEM', '{APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS}'),
('RASS', 'Risk Adjustment Suite of Systems (RASS)', 'IT_SYSTEM', '{MEDICARE_ADVANTAGE_AND_PART_D}'),
('DDPS', 'Drug Data Processing System (DDPS)', 'IT_SYSTEM', '{MEDICARE_ADVANTAGE_AND_PART_D}'),
('OACT', 'Office of the Actuary (OACT)', 'OTHER', '{EVALUATION_AND_REVIEW}'),
('QPP', 'Quality Payment Program (QPP)', 'OTHER', '{QUALITY}'),
('PAM', 'Patient Activation Measure (PAM)', 'CONTRACTOR', '{CONTRACT_VEHICLES,QUALITY}');

WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsPrimary, IsTeam) AS (
    VALUES

    ('Research and Rapid Cycle Evaluation Group (RREG)', 'RREG', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Federally Funded Research and Development Center (FFRDC)', 'FFRDC', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Actuarial Research and Design Services (ARDS)', 'ARDS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Transformed Medicaid Statistical Information System (T_MISS)', 'T_MISS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Enterprise Privacy Policy Engine Cloud (EPPE)', 'EPPE', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Division of Stakeholder Engagement and Policy (DSEP)', 'DSEP', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('CMMI Analysis and Management System (AMS)', 'AMS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Innovation Center Landing Page (IC_LANDING)', 'IC_LANDING', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Risk Adjustment Suite of Systems (RASS)', 'RASS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Drug Data Processing System (DDPS)', 'DDPS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Office of the Actuary (OACT)', 'OACT', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Quality Payment Program (QPP)', 'QPP', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE),
    ('Patient Activation Measure (PAM)', 'PAM', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE)
)

-- Insert solution contacts into the mto common solution contact table
INSERT INTO mto_common_solution_contact(
    id,
    mto_common_solution_key,
    name,
    email,
    role,
    is_primary,
    is_team,
    created_by,
    created_dts
)

SELECT
    gen_random_uuid() AS id,
    pos.key AS mto_common_solution_key,
    pocs.name AS name, --noqa
    pocs.email,
    pocs.role AS role, --noqa
    pocs.IsPrimary AS is_primary,
    pocs.IsTeam AS is_team,
    '00000001-0001-0001-0001-000000000001' AS created_by, --System account
    current_timestamp AS created_dts

FROM pocs
INNER JOIN mto_common_solution AS pos ON cast(pos.key AS TEXT) = pocs.solutionkey;
