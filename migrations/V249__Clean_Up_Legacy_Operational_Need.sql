-- We are removing legacy constraint of link pointing a solution to a document. This way, we don't need to worry about unlinking a document from a solution if the doc is removed.
ALTER TABLE
plan_document_solution_link
DROP CONSTRAINT
fk_doc_sol_doc;
