-- Add a boolean column to the table possible_operational_solution_contact to indicate if the contact is the primary contact for the operational solution
ALTER TABLE possible_operational_solution_contact
  ADD COLUMN is_primary_contact BOOLEAN default null;

-- Select the top 1 contact for each operational solution and set the is_primary_contact column to true
UPDATE possible_operational_solution_contact
SET is_primary_contact = true
WHERE id IN (
  SELECT poc.id
  FROM possible_operational_solution_contact poc
         INNER JOIN (
          SELECT possible_operational_solution_id, MIN(id) AS id
          FROM possible_operational_solution_contact
          GROUP BY possible_operational_solution_id
        ) poc2 ON poc.possible_operational_solution_id = poc2.possible_operational_solution_id AND poc.id = poc2.id
);
