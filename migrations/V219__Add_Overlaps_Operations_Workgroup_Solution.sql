-- Add OVERLAPS_OPERATIONS_WORKGROUP to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'OVERLAPS_OPERATIONS_WORKGROUP';

COMMIT;

-- Insert OVERLAPS_OPERATIONS_WORKGROUP into the mto common solution table
INSERT INTO mto_common_solution("id", "key", "name", "type", "subjects") VALUES
(gen_random_uuid(), 'OVERLAPS_OPERATIONS_WORKGROUP', 'Overlaps Operations Workgroup', 'OTHER', '{DATA}');

-- Add OVERLAPS_OPERATIONS_WORKGROUP as common solution for MANAGE_PROV_OVERLAP milestone
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('MANAGE_PROV_OVERLAP', 'OVERLAPS_OPERATIONS_WORKGROUP');

-- Add OVERLAPS_OPERATIONS_WORKGROUP as common solution for MANAGE_BEN_OVERLAP milestone
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('MANAGE_BEN_OVERLAP', 'OVERLAPS_OPERATIONS_WORKGROUP');
