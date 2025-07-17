-- Add Additional Solutions to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'NCQA';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'RMD';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'MS_FORMS';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'RESDAC_CMDS';

COMMIT;

-- Insert solutions into the mto common solution table
INSERT INTO mto_common_solution("key", "name", "type", "subjects") VALUES
('NCQA', 'National Committee for Quality Assurance (NCQA)', 'OTHER', '{CONTRACT_VEHICLES,QUALITY}'),
('RMD', 'Rapid Measure Development (RMD)', 'CONTRACTOR', '{CONTRACT_VEHICLES,QUALITY}'),
('MS_FORMS', 'Microsoft Forms (MS Forms)', 'IT_SYSTEM', '{APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS}'),
('RESDAC_CMDS', 'ResDAC CMMI Model Data Sharing Model Participation Data Initiative (ResDAC-CMDS)', 'OTHER', '{DATA}');
