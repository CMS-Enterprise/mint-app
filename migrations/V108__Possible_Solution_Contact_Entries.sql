
INSERT INTO possible_operational_solution("id", "sol_name", "sol_key", "created_by") VALUES -- TODO: SW verify that this doesn't have side effects in the code
(38, 'Innovation Support Platform', 'ISP', '00000001-0001-0001-0001-000000000001'),
(39, 'Measure and Instrument Development and Support', 'MIDS', '00000001-0001-0001-0001-000000000001');



WITH pocs(SolutionName, SolutionKey, Name, Email, Role) AS (
  VALUES

('4innovation', 'INNOVATION', '4i/ACO-OS Team', 'ACO-OIT@cms.hhs.gov', 'mailbox'),
('4innovation', 'INNOVATION', 'Aparna Vyas', 'aparna.vyas@cms.hhs.gov', 'Project Lead'),
('4innovation', 'INNOVATION', 'Ashley Corbin', 'ashley.corbin@cms.hhs.gov', 'Subject Matter Expert'),
('4innovation', 'INNOVATION', 'Nora Fleming', 'nora.fleming@cms.hhs.gov', 'Subject Matter Expert'),
('Accountable Care Organization - Operational System', 'ACO_OS', '4i/ACO-OS Team', 'ACO-OIT@cms.hhs.gov', 'mailbox'),
('Accountable Care Organization - Operational System', 'ACO_OS', 'Aparna Vyas', 'aparna.vyas@cms.hhs.gov', 'Project Lead'),
('Accountable Care Organization - Operational System', 'ACO_OS', 'Ashley Corbin', 'ashley.corbin@cms.hhs.gov', 'Subject Matter Expert'),
('Accountable Care Organization - Operational System', 'ACO_OS', 'Nora Fleming', 'nora.fleming@cms.hhs.gov', 'Subject Matter Expert'),
('Automated Plan Payment System', 'APPS', 'Aliza Kim', 'aliza.kim@cms.hhs.gov', 'Project Lead'),
('Automated Plan Payment System', 'APPS', 'Edgar Howard', 'edgar.howard@cms.hhs.gov', 'Director, Division of Payment Operations'),
('Beneficiary Claims Data API', 'BCDA', 'BCDA Team', 'bcapi@cms.hhs.gov', 'mailbox'),
('Beneficiary Claims Data API', 'BCDA', 'Nicole Pham', 'xuanphien.pham@cms.hhs.gov', 'Product Manager'),
('Centralized Data Exchange', 'CDX', 'Yolanda Villanova', 'yolanda.villanova@cms.hhs.gov', 'Product Owner'),
('Centralized Data Exchange', 'CDX', 'Hung Van', 'hung.van@cms.hhs.gov', 'Technical Lead'),
('Chronic Conditions Warehouse', 'CCW', 'Velda McGhee', 'velda.mcghee@cms.hhs.gov', 'CMMI Government Task Lead'),
('CMS Box', 'CMS_BOX', 'MINT Team', 'MINTTeam@cms.hhs.gov', 'mailbox'),
('CMS Qualtrics', 'CMS_QUALTRICS', 'MINT Team', 'MINTTeam@cms.hhs.gov', 'mailbox'),
('Consolidated Business Operations Support Center', 'CBOSC', 'Richard Speights', 'richard.speights@cms.hhs.gov', 'Contracting Officer Representative'),
('Consolidated Business Operations Support Center', 'CBOSC', 'Don Rocker', 'don.rocker1@cms.hhs.gov', 'Operations and Management Lead '),
('CPI Vetting', 'CPI_VETTING', 'MINT Team', 'MINTTeam@cms.hhs.gov', 'mailbox'),
('Electronic File Transfer', 'EFT', 'MINT Team', 'MINTTeam@cms.hhs.gov', 'mailbox'),
('Expanded Data Feedback Reporting', 'EDFR', 'Zach Nall', 'r.nall@cms.hhs.gov', 'Product Owner'),
('GovDelivery', 'GOVDELIVERY', 'Andrew Rushton', 'andrew.rushton@cms.hhs.gov', 'Administrator'),
('GovDelivery', 'GOVDELIVERY', 'Alison Rigby', 'alison.rigby@cms.hhs.gov', 'Administrator'),
('GrantSolutions', 'GS', 'Mary Greene', 'mary.greene@cms.hhs.gov', 'Director, Division of Grants Management'),
('GrantSolutions', 'GS', 'Michelle Brown', 'michelle.brown@cms.hhs.gov', 'Deputy Director, Division of Grants Management'),
('Healthcare Integrated General Ledger Accounting System', 'HIGLAS', 'Donna Schmidt', 'donna.schmidt@cms.hhs.gov', 'Director, Division of System Support, Operation and Security (DSSOS)'),
('Health Data Reporting', 'HDR', 'Hung Van', 'hung.van@cms.hhs.gov', 'Technical Lead'),
('Health Data Reporting', 'HDR', 'Curtis Naumann', 'curtis.naumann@cms.hhs.gov', 'Product Owner'),
('Health Plan Management System', 'HPMS', 'MINT Team', 'MINTTeam@cms.hhs.gov', 'mailbox'),
('Innovation Payment Contractor', 'IPC', 'Ron Topper', 'ronald.topper@cms.hhs.gov', 'Director, Division of Budget Operations & Management (DBOM)'),
('Innovation Payment Contractor', 'IPC', 'Sue Nonemaker', 'sue.nonemaker@cms.hhs.gov', 'Project Lead'),
('Innovation Payment Contractor', 'IPC', 'Alyssa Larson', 'alyssa.larson@cms.hhs.gov', 'Subject Matter Expert'),
('Innovation Payment Contractor', 'IPC', 'Philip Tennant', 'philip.tennant@cms.hhs.gov', 'Subject Matter Expert'),
('Innovation Support Platform', 'ISP', 'Hung Van', 'hung.van@cms.hhs.gov', 'Technical Lead'),
('Innovation Support Platform', 'ISP', 'Joe Pusateri', 'joe.pusateri@cms.hhs.gov', 'Contracting Officer Representative'),
('Integrated Data Repository', 'IDR', 'Jim Brogan', 'jim.brogan@cms.hhs.gov', 'Deputy Director, Division of Enterprise Information Management Services'),
('Integrated Data Repository', 'IDR', 'Murari Selvakesavan', 'murari.selvakesavan@cms.hhs.gov', 'System Owner'),
('Learning and Diffusion Group', 'LDG', 'Andrew Philip', 'andrew.philip@cms.hhs.gov', 'Director, Division of Model Learning Systems (DMLS)'),
('Learning and Diffusion Group', 'LDG', 'Taiwanna Messam Lucienne', 'taiwanna.lucienne@cms.hhs.gov', 'Deputy Director, Division of Model Learning Systems (DMLS)'),
('Learning and Diffusion Group', 'LDG', 'Alexis Malfesi', 'alexis.malfesi@cms.hhs.gov', 'Beneficiary Listening Session Point of Contact'),
('Learning and Diffusion Group', 'LDG', 'Erin Carrillo', 'erin.carrillo1@cms.hhs.gov', 'Beneficiary Listening Session Point of Contact'),
('Legal Vertical', 'LV', 'Megan Hyde', 'megan.hyde@cms.hhs.gov', 'Co-team Lead'),
('Legal Vertical', 'LV', 'Erin Hagenbrok', 'erin.hagenbrok1@cms.hhs.gov', 'Co-team Lead'),
('Legal Vertical', 'LV', 'Ann Vrabel', 'ann.vrabel1@cms.hhs.gov', 'Division Director'),
('Legal Vertical', 'LV', 'Melanie Dang', 'melanie.dang1@cms.hhs.gov', 'Deputy Division Director'),
('Master Data Management', 'MDM', 'Celia Shaunessy', 'celia.shaunessy@cms.hhs.gov', 'CMMI/BSG Point of Contact'),
('Master Data Management', 'MDM', 'Felicia Addai', 'felicia.addai2@cms.hhs.gov', 'CMMI/BSG Project Support'),
('Master Data Management', 'MDM', 'Miyani Treva', 'miyani.treva@cms.hhs.gov', 'Overlaps Operations Support'),
('Master Data Management', 'MDM', 'Sameera Gudipati', 'sameera.gudipati1@cms.hhs.gov', 'OIT Point of Contact'),
('Master Data Management', 'MDM', 'Glenn Eyler', 'glenn.eyler@cms.hhs.gov', 'OIT Government Task Lead'),
('Measure and Instrument Development and Support', 'MIDS', 'Dustin Allison', 'dustin.allison@cms.hhs.gov', 'Quality Vertical Program Analyst'),
('Measure and Instrument Development and Support', 'MIDS', 'Teresa Winder-Wells', 'teresa.winder-wells@cms.hhs.gov', 'Contracting Officer Representative, Division of Centralized Contracts and Services (DCCS)'),
('Measure and Instrument Development and Support', 'MIDS', 'Tim Day', 'timothy.day@cms.hhs.gov', 'Quality Subject Matter Expert (QSME)'),
('Measure and Instrument Development and Support', 'MIDS', 'Jim Gerber', 'james.gerber@cms.hhs.gov', 'Director, Division of Portfolio Management & Strategy'),
('Medicare Advantage Prescription Drug System', 'MARX', 'MINT Team', 'MINTTeam@cms.hhs.gov', 'mailbox'),
('Outlook Mailbox', 'OUTLOOK_MAILBOX', 'MINT Team', 'MINTTeam@cms.hhs.gov', 'mailbox'),
('Quality Vertical', 'QV', 'Susannah Bernheim', 'susannah.bernheim@cms.hhs.gov', 'Chief Quality Officer and Senior Advisor to the CMMI Front Office, Quality Vertical Lead'),
('Quality Vertical', 'QV', 'Dustin Allison', 'dustin.allison1@cms.hhs.gov', 'Program Analyst'),
('Quality Vertical', 'QV', 'Sasha Gibbel', 'sasha.gibbel@cms.hhs.gov', 'Quality Analyst'),
('Quality Vertical', 'QV', 'Whitney Saint-Fleur', 'whitney.saintfleur@cms.hhs.gov', 'Quality Analyst'),
('Research, Measurement, Assessment, Design, and Analysis', 'RMADA', 'Joe Pusateri', 'joseph.pusateri@cms.hhs.gov', 'Contracting Officer Representative'),
('Salesforce Application Review and Scoring', 'ARS', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead'),
('Salesforce Application Review and Scoring', 'ARS', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact'),
('Salesforce CONNECT', 'CONNECT', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead'),
('Salesforce CONNECT', 'CONNECT', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact'),
('Salesforce Letter of Intent', 'LOI', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead'),
('Salesforce Letter of Intent', 'LOI', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact'),
('Salesforce Project Officer Support Tool / Portal', 'POST_PORTAL', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead'),
('Salesforce Project Officer Support Tool / Portal', 'POST_PORTAL', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact'),
('Salesforce Request for Application', 'RFA', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead'),
('Salesforce Request for Application', 'RFA', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact'),
('Shared Systems', 'SHARED_SYSTEMS', 'Donna Schmidt', 'donna.schmidt@cms.hhs.gov', 'Director, Division of System Support, Operation and Security (DSSOS)'),
('Shared Systems', 'SHARED_SYSTEMS', 'Madhu Annadata', 'madhu.annadata@cms.hhs.gov', 'Subject Matter Expert')
)

INSERT INTO possible_operational_solution_contact(
    id,
    possible_operational_solution_id,
    name,
    email,
    role,
    created_by,
    created_dts
)

SELECT
  gen_random_uuid() AS id,
  pos.id as possible_operational_solution_id,
  pocs.name AS name,
  pocs.email AS email,
  pocs.role AS role, --TODO: do we want this to be nullable?
  '00000001-0001-0001-0001-000000000001' AS created_by, --System account
  current_timestamp AS created_dts

FROM pocs
JOIN possible_operational_solution pos on CAST(pos.sol_key as TEXT) = pocs.solutionkey 
