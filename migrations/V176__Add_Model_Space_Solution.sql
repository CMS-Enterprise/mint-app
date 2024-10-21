-- Add MODEL_SPACE to the ENUM type
ALTER TYPE OPERATIONAL_SOLUTION_KEY ADD VALUE 'MODEL_SPACE';

COMMIT;

-- Insert MODEL_SPACE into the possible operational solution table
INSERT INTO possible_operational_solution("id", "sol_name", "sol_key", "created_by") VALUES
(41, 'Model Space', 'MODEL_SPACE', '00000001-0001-0001-0001-000000000001');
