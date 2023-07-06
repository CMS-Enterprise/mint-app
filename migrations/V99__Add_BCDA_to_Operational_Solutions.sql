-- Add BCDA to the ENUM type
ALTER TYPE OPERATIONAL_SOLUTION_KEY ADD VALUE 'BCDA';

COMMIT;

-- Insert BCDA into the possible operational solution table
INSERT INTO public.possible_operational_solution(
  "id",
  "sol_name",
  "sol_key",
  "treat_as_other",
  "created_by"
)
VALUES(
  37,
  'Beneficiary Claims Data API (BCDA)',
  'BCDA',
  'FALSE',
  '00000001-0001-0001-0001-000000000001'
);

SELECT CREATE_POSSIBLE_NEED_SOLUTION_LINK(
  'SEND_REPDATA_TO_PART'::OPERATIONAL_NEED_KEY,
  '{BCDA}'::OPERATIONAL_SOLUTION_KEY[]
);
