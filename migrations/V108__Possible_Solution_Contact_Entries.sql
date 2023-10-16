
INSERT INTO possible_operational_solution("id", "sol_name", "sol_key", "created_by") VALUES
(38, 'Innovation Support Platform', 'ISP', '00000001-0001-0001-0001-000000000001'),
(39, 'Measure and Instrument Development and Support', 'MIDS', '00000001-0001-0001-0001-000000000001');



WITH pocs(SolutionName, SolutionKey, Name, Email, Role, IsTeam) AS (
  VALUES

('4innovation', 'INNOVATION', '4i/ACO-OS Team', 'ACO-OIT@cms.hhs.gov', NULL, TRUE),
('4innovation', 'INNOVATION', 'Aparna Vyas', 'aparna.vyas@cms.hhs.gov', 'Project Lead', FALSE),
('4innovation', 'INNOVATION', 'Ashley Corbin', 'ashley.corbin@cms.hhs.gov', 'Subject Matter Expert', FALSE),
('4innovation', 'INNOVATION', 'Nora Fleming', 'nora.fleming@cms.hhs.gov', 'Subject Matter Expert', FALSE),
('Accountable Care Organization - Operational System', 'ACO_OS', '4i/ACO-OS Team', 'ACO-OIT@cms.hhs.gov', NULL, TRUE),
('Accountable Care Organization - Operational System', 'ACO_OS', 'Aparna Vyas', 'aparna.vyas@cms.hhs.gov', 'Project Lead', FALSE),
('Accountable Care Organization - Operational System', 'ACO_OS', 'Ashley Corbin', 'ashley.corbin@cms.hhs.gov', 'Subject Matter Expert', FALSE),
('Accountable Care Organization - Operational System', 'ACO_OS', 'Nora Fleming', 'nora.fleming@cms.hhs.gov', 'Subject Matter Expert', FALSE),
('Automated Plan Payment System', 'APPS', 'Aliza Kim', 'aliza.kim@cms.hhs.gov', 'Project Lead', FALSE),
('Automated Plan Payment System', 'APPS', 'Edgar Howard', 'edgar.howard@cms.hhs.gov', 'Director, Division of Payment Operations', FALSE),
('Beneficiary Claims Data API', 'BCDA', 'BCDA Team', 'bcapi@cms.hhs.gov', NULL, TRUE),
('Beneficiary Claims Data API', 'BCDA', 'Nicole Pham', 'xuanphien.pham@cms.hhs.gov', 'Product Manager', FALSE),
('Centralized Data Exchange', 'CDX', 'Yolanda Villanova', 'yolanda.villanova@cms.hhs.gov', 'Product Owner', FALSE),
('Centralized Data Exchange', 'CDX', 'Hung Van', 'hung.van@cms.hhs.gov', 'Technical Lead', FALSE),
('Chronic Conditions Warehouse', 'CCW', 'Velda McGhee', 'velda.mcghee@cms.hhs.gov', 'CMMI Government Task Lead', FALSE),
('CMS Box', 'CMS_BOX', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE),
('CMS Qualtrics', 'CMS_QUALTRICS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE),
('Consolidated Business Operations Support Center', 'CBOSC', 'Keir Shine', 'keir.shine@cms.hhs.gov', 'Co-Lead', FALSE),
('Consolidated Business Operations Support Center', 'CBOSC', 'Don Rocker', 'don.rocker1@cms.hhs.gov', 'Operations and Management Lead ', FALSE),
('CPI Vetting', 'CPI_VETTING', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE),
('Electronic File Transfer', 'EFT', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE),
('Expanded Data Feedback Reporting', 'EDFR', 'Zach Nall', 'r.nall@cms.hhs.gov', 'Product Owner', FALSE),
('GovDelivery', 'GOVDELIVERY', 'Andrew Rushton', 'andrew.rushton@cms.hhs.gov', 'Administrator', FALSE),
('GovDelivery', 'GOVDELIVERY', 'Alison Rigby', 'alison.rigby@cms.hhs.gov', 'Administrator', FALSE),
('GrantSolutions', 'GS', 'Mary Greene', 'mary.greene@cms.hhs.gov', 'Director, Division of Grants Management', FALSE),
('GrantSolutions', 'GS', 'Michelle Brown', 'michelle.brown@cms.hhs.gov', 'Deputy Director, Division of Grants Management', FALSE),
('Healthcare Integrated General Ledger Accounting System', 'HIGLAS', 'Donna Schmidt', 'donna.schmidt@cms.hhs.gov', 'Director, Division of System Support, Operation and Security (DSSOS)', FALSE),
('Health Data Reporting', 'HDR', 'Hung Van', 'hung.van@cms.hhs.gov', 'Technical Lead', FALSE),
('Health Data Reporting', 'HDR', 'Curtis Naumann', 'curtis.naumann@cms.hhs.gov', 'Product Owner', FALSE),
('Health Plan Management System', 'HPMS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE),
('Innovation Payment Contractor', 'IPC', 'Ron Topper', 'ronald.topper@cms.hhs.gov', 'Director, Division of Budget Operations & Management (DBOM)', FALSE),
('Innovation Payment Contractor', 'IPC', 'Sue Nonemaker', 'sue.nonemaker@cms.hhs.gov', 'Project Lead', FALSE),
('Innovation Payment Contractor', 'IPC', 'Alyssa Larson', 'alyssa.larson@cms.hhs.gov', 'Subject Matter Expert', FALSE),
('Innovation Payment Contractor', 'IPC', 'Philip Tennant', 'philip.tennant@cms.hhs.gov', 'Subject Matter Expert', FALSE),
('Innovation Support Platform', 'ISP', 'Hung Van', 'hung.van@cms.hhs.gov', 'Technical Lead', FALSE),
('Innovation Support Platform', 'ISP', 'Joe Pusateri', 'joe.pusateri@cms.hhs.gov', 'Contracting Officer Representative', FALSE),
('Integrated Data Repository', 'IDR', 'Jim Brogan', 'jim.brogan@cms.hhs.gov', 'Deputy Director, Division of Enterprise Information Management Services', FALSE),
('Integrated Data Repository', 'IDR', 'Murari Selvakesavan', 'murari.selvakesavan@cms.hhs.gov', 'System Owner', FALSE),
('Learning and Diffusion Group', 'LDG', 'Andrew Philip', 'andrew.philip@cms.hhs.gov', 'Director, Division of Model Learning Systems (DMLS)', FALSE),
('Learning and Diffusion Group', 'LDG', 'Taiwanna Messam Lucienne', 'taiwanna.lucienne@cms.hhs.gov', 'Deputy Director, Division of Model Learning Systems (DMLS)', FALSE),
('Learning and Diffusion Group', 'LDG', 'Alexis Malfesi', 'alexis.malfesi@cms.hhs.gov', 'Beneficiary Listening Session Point of Contact', FALSE),
('Learning and Diffusion Group', 'LDG', 'Erin Carrillo', 'erin.carrillo1@cms.hhs.gov', 'Beneficiary Listening Session Point of Contact', FALSE),
('Legal Vertical', 'LV', 'Megan Hyde', 'megan.hyde@cms.hhs.gov', 'Co-team Lead', FALSE),
('Legal Vertical', 'LV', 'Erin Hagenbrok', 'erin.hagenbrok1@cms.hhs.gov', 'Co-team Lead', FALSE),
('Legal Vertical', 'LV', 'Ann Vrabel', 'ann.vrabel1@cms.hhs.gov', 'Division Director', FALSE),
('Legal Vertical', 'LV', 'Melanie Dang', 'melanie.dang1@cms.hhs.gov', 'Deputy Division Director', FALSE),
('Master Data Management', 'MDM', 'Celia Shaunessy', 'celia.shaunessy@cms.hhs.gov', 'CMMI/BSG Point of Contact', FALSE),
('Master Data Management', 'MDM', 'Felicia Addai', 'felicia.addai2@cms.hhs.gov', 'CMMI/BSG Project Support', FALSE),
('Master Data Management', 'MDM', 'Miyani Treva', 'miyani.treva@cms.hhs.gov', 'Overlaps Operations Support', FALSE),
('Master Data Management', 'MDM', 'Sameera Gudipati', 'sameera.gudipati1@cms.hhs.gov', 'OIT Point of Contact', FALSE),
('Master Data Management', 'MDM', 'Glenn Eyler', 'glenn.eyler@cms.hhs.gov', 'OIT Government Task Lead', FALSE),
('Measure and Instrument Development and Support', 'MIDS', 'Dustin Allison', 'dustin.allison@cms.hhs.gov', 'Quality Vertical Program Analyst', FALSE),
('Measure and Instrument Development and Support', 'MIDS', 'Teresa Winder-Wells', 'teresa.winder-wells@cms.hhs.gov', 'Contracting Officer Representative, Division of Centralized Contracts and Services (DCCS)', FALSE),
('Measure and Instrument Development and Support', 'MIDS', 'Tim Day', 'timothy.day@cms.hhs.gov', 'Quality Subject Matter Expert (QSME)', FALSE),
('Measure and Instrument Development and Support', 'MIDS', 'Jim Gerber', 'james.gerber@cms.hhs.gov', 'Director, Division of Portfolio Management & Strategy', FALSE),
('Medicare Advantage Prescription Drug System', 'MARX', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE),
('Outlook Mailbox', 'OUTLOOK_MAILBOX', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE),
('Quality Vertical', 'QV', 'Susannah Bernheim', 'susannah.bernheim@cms.hhs.gov', 'Chief Quality Officer and Senior Advisor to the CMMI Front Office, Quality Vertical Lead', FALSE),
('Quality Vertical', 'QV', 'Dustin Allison', 'dustin.allison1@cms.hhs.gov', 'Program Analyst', FALSE),
('Quality Vertical', 'QV', 'Sasha Gibbel', 'sasha.gibbel@cms.hhs.gov', 'Quality Analyst', FALSE),
('Quality Vertical', 'QV', 'Whitney Saint-Fleur', 'whitney.saintfleur@cms.hhs.gov', 'Quality Analyst', FALSE),
('Research, Measurement, Assessment, Design, and Analysis', 'RMADA', 'Joe Pusateri', 'joseph.pusateri@cms.hhs.gov', 'Contracting Officer Representative', FALSE),
('Salesforce Application Review and Scoring', 'ARS', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead', FALSE),
('Salesforce Application Review and Scoring', 'ARS', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact', FALSE),
('Salesforce CONNECT', 'CONNECT', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead', FALSE),
('Salesforce CONNECT', 'CONNECT', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact', FALSE),
('Salesforce Letter of Intent', 'LOI', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead', FALSE),
('Salesforce Letter of Intent', 'LOI', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact', FALSE),
('Salesforce Project Officer Support Tool / Portal', 'POST_PORTAL', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead', FALSE),
('Salesforce Project Officer Support Tool / Portal', 'POST_PORTAL', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact', FALSE),
('Salesforce Request for Application', 'RFA', 'Elia Cossis', 'elia.cossis@cms.hhs.gov', 'Platform Lead', FALSE),
('Salesforce Request for Application', 'RFA', 'Chinelo Johnson', 'echinelo.johnson@cms.hhs.gov', 'Point of Contact', FALSE),
('Shared Systems', 'SHARED_SYSTEMS', 'Donna Schmidt', 'donna.schmidt@cms.hhs.gov', 'Director, Division of System Support, Operation and Security (DSSOS)', FALSE),
('Shared Systems', 'SHARED_SYSTEMS', 'Madhu Annadata', 'madhu.annadata@cms.hhs.gov', 'Subject Matter Expert', FALSE)
)

INSERT INTO possible_operational_solution_contact(
    id,
    possible_operational_solution_id,
    name,
    email,
    role,
    is_team,
    created_by,
    created_dts
)

SELECT
  gen_random_uuid() AS id,
  pos.id as possible_operational_solution_id,
  pocs.name AS name,
  pocs.email AS email,
  pocs.role AS role,
  pocs.IsTeam as is_team,
  '00000001-0001-0001-0001-000000000001' AS created_by, --System account
  current_timestamp AS created_dts

FROM pocs
JOIN possible_operational_solution pos on CAST(pos.sol_key as TEXT) = pocs.solutionkey 
