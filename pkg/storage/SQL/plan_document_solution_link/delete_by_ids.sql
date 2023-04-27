WITH PlanDocumentSolutionLinkDelete AS ( --noqa
    SELECT
        unnest(cast(:document_ids AS UUID[])) AS DocumentID,
        cast(:solution_id AS UUID) AS SolutionID
)

DELETE FROM plan_document_solution_link
USING PlanDocumentSolutionLinkDelete
WHERE
    plan_document_solution_link.solution_id = PlanDocumentSolutionLinkDelete.SolutionID
    AND plan_document_solution_link.document_id = PlanDocumentSolutionLinkDelete.DocumentID
