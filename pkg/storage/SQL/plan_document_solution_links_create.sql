WITH PlanDocumentSolutionLink AS (
    SELECT
        unnest((:document_ids)::UUID []) AS DocumentID,
        :solution_id AS SolutionID
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
    :created_by AS created_by
FROM PlanDocumentSolutionLink
RETURNING id,
  solution_id,
  document_id,
  created_by,
  created_dts,
  modified_by,
  modified_dts
