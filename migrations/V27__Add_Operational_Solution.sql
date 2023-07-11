CREATE TYPE OP_SOLUTION_STATUS AS ENUM (
    'NOT_STARTED',
    'ONBOARDING',
    'BACKLOG',
    'IN_PROGRESS',
    'COMPLETED',
    'AT_RISK'
);


CREATE TABLE operational_solution (
    id UUID PRIMARY KEY NOT NULL,
    operational_need_id UUID NOT NULL, --foreign key to operational need
    needed BOOL NOT NULL DEFAULT TRUE,
    solution_type INT,
    name_other ZERO_STRING,

    poc_name ZERO_STRING,
    poc_email EMAIL,

    must_start_dts TIMESTAMP WITH TIME ZONE,
    must_finish_dts TIMESTAMP WITH TIME ZONE,
    status OP_SOLUTION_STATUS NOT NULL DEFAULT 'NOT_STARTED',

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);
ALTER TABLE operational_solution
ADD CONSTRAINT fk_operational_solution_need FOREIGN KEY (operational_need_id)
REFERENCES public.operational_need (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;


ALTER TABLE operational_solution
ADD CONSTRAINT fk_solution_possible_solution FOREIGN KEY (solution_type)
REFERENCES public.possible_operational_solution (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;


ALTER TABLE operational_solution
ADD CONSTRAINT unique_solution_per_need UNIQUE (operational_need_id, solution_type); -- 1 solution type per need

ALTER TABLE operational_solution
ADD CONSTRAINT unique_solution_name_other_per_plan UNIQUE (operational_need_id, name_other); -- 1 specifc custom solution per model

ALTER TABLE operational_solution
ADD CONSTRAINT solution_type_null_if_other CHECK (
  (solution_type IS NULL OR name_other IS NULL) -- Either solution type or name_other must be null
    AND NOT
    (solution_type IS NULL AND name_other IS NULL) -- Either solution_type or name_other must be defined
  ); -- Can't be a custom type and a specifc type at the same time. One is required

SELECT audit.AUDIT_TABLE('public', 'operational_solution', 'id', 'operational_need_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);
