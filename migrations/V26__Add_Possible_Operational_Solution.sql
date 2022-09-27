CREATE TABLE possible_operational_solution (
    id SERIAL PRIMARY KEY NOT NULL,
    name ZERO_STRING NOT NULL,

    --TODO add fields
    -- default LINKING TABLE TO default POCS


    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);
-- ALTER TABLE operational_solution
-- ADD CONSTRAINT fk_operational_solution_plan FOREIGN KEY (model_plan_id)
-- REFERENCES public.model_plan (id) MATCH SIMPLE
-- ON UPDATE NO ACTION
-- ON DELETE NO ACTION;


-- ALTER TABLE possible_operational_solution
-- ADD CONSTRAINT fk_need_possible_need FOREIGN KEY (need_type)
-- REFERENCES public.possible_operational_need (id) MATCH SIMPLE
-- ON UPDATE NO ACTION
-- ON DELETE NO ACTION;
