CREATE TABLE plan_document_solution_link (
    id UUID PRIMARY KEY NOT NULL,
    solution_id UUID NOT NULL,
    document_id UUID NOT NULL,

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);

ALTER TABLE plan_document_solution_link
ADD CONSTRAINT fk_doc_sol_sol FOREIGN KEY (solution_id)
REFERENCES public.operational_solution (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

ALTER TABLE plan_document_solution_link
ADD CONSTRAINT fk_doc_sol_doc FOREIGN KEY (document_id)
REFERENCES public.plan_document (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

ALTER TABLE plan_document_solution_link
ADD CONSTRAINT unique_document_id_and_solution_id UNIQUE (solution_id, document_id);
