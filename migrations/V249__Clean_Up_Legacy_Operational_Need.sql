-- We are removing legacy constraint of link pointing a solution to a document. This way, we don't need to worry about unlinking a document from a solution if the doc is removed.
ALTER TABLE
plan_document_solution_link
DROP CONSTRAINT
fk_doc_sol_doc;


COMMENT ON TABLE operational_need IS 'Deprecated table - operational needs are now managed via mto_milestone';
COMMENT ON TABLE operational_solution IS 'Deprecated table - operational solutions are now managed via mto_solution';
COMMENT ON TABLE operational_solution_subtask IS 'Deprecated table';
COMMENT ON TABLE plan_document_solution_link IS 'Deprecated table';
COMMENT ON TABLE possible_need_solution_link IS 'Deprecated table See MTO common need solution link';
COMMENT ON TABLE possible_operational_need IS 'Deprecated table. See MTO common milestone';
COMMENT ON TABLE possible_operational_solution IS 'Deprecated table. See MTO common solution';
COMMENT ON TABLE possible_operational_solution_contact IS 'Deprecated table. See MTO common solution contact';
