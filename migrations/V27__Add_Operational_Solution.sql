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
    operational_need_id UUID NOT NULL, --foreign key to model plan
    solution_type INT,
    solution_other ZERO_STRING,

    poc_name ZERO_STRING,
    poc_email EMAIL,

    must_start_dts TIMESTAMP WITH TIME ZONE,
    must_finish_dts TIMESTAMP WITH TIME ZONE,
    status OP_SOLUTION_STATUS NOT NULL DEFAULT 'NOT_STARTED',

    --TODO add fields

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
