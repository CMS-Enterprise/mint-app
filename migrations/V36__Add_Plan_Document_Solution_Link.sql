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
