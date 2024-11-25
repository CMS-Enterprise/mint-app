WITH PlanDocumentSolutionLink AS (
    SELECT
        unnest(cast(:document_ids AS UUID[])) AS DocumentID,
        cast(:solution_id AS UUID) AS SolutionID,
        cast(:created_by AS UUID) AS CreatedBy
)

INSERT INTO plan_document_solution_link (
    id,
    solution_id,
    document_id,
    created_by
)
SELECT
    gen_random_uuid() AS id,
    PlanDocumentSolutionLink.SolutionID AS solution_id,
    PlanDocumentSolutionLink.DocumentID AS document_id,
    PlanDocumentSolutionLink.CreatedBy AS created_by
FROM PlanDocumentSolutionLink
RETURNING
    id,
    solution_id,
    document_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
