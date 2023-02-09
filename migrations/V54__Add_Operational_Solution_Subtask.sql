CREATE TYPE OPERATIONAL_SOLUTION_SUBTASK_STATUS AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'DONE'
);

CREATE TABLE operational_solution_subtask (
    id UUID PRIMARY KEY NOT NULL,
    solution_id UUID NOT NULL,   --foreign key to model plan
    name ZERO_STRING,
    status OPERATIONAL_SOLUTION_SUBTASK_STATUS NOT NULL DEFAULT 'TODO',

    --META
    created_by UUID NOT NULL REFERENCES public.user_account (id) MATCH SIMPLE,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE
);


ALTER TABLE operational_solution_subtask
ADD CONSTRAINT fk_operational_solution_subtask FOREIGN KEY (solution_id)
REFERENCES public.operational_solution (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

SELECT audit.AUDIT_TABLE('public', 'operational_solution_subtask', 'id', 'solution_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{name, status}'::TEXT[]);
