-- Adding foreign key constraint for the need_type column
ALTER TABLE possible_need_solution_link
  ADD CONSTRAINT possible_need_solution_link_fk_need_type
    FOREIGN KEY (need_type)
      REFERENCES possible_operational_need(id);

-- Adding foreign key constraint for the solution_type column
ALTER TABLE possible_need_solution_link
  ADD CONSTRAINT possible_need_solution_link_fk_solution_type
    FOREIGN KEY (solution_type)
      REFERENCES possible_operational_solution(id);
