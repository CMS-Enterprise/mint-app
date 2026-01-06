-- Add MCBS to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'MCBS';

COMMIT;

-- Insert MCBS into the mto common solution table
INSERT INTO mto_common_solution("id", "key", "name", "type", "subjects") VALUES
(gen_random_uuid(), 'MCBS', 'Medicare Current Beneficiary Survey (MCBS)', 'IT_SYSTEM', '{DATA}');
