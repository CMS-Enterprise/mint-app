-- Add HETS to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'HETS';

COMMIT;

-- Insert HETS into the mto common solution table
INSERT INTO mto_common_solution("id", "key", "name", "type", "subjects") VALUES
(gen_random_uuid(), 'HETS', 'HIPAA Eligibility Transaction System (HETS)', 'IT_SYSTEM', '{DATA}');
