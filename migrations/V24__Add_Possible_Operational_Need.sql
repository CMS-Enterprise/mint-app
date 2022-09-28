CREATE TABLE possible_operational_need (
    id SERIAL PRIMARY KEY NOT NULL, -- instead of UUID
    full_name ZERO_STRING NOT NULL,
    short_name ZERO_STRING NOT NULL,


    --TODO add fields
    -- possible_solutions UUID[], --TODO should this live on the solutions table to identify what the solution will satisfy? Or here?

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);
-- ALTER TABLE operational_need
-- ADD CONSTRAINT fk_cr_tdl_plan FOREIGN KEY (model_plan_id)
-- REFERENCES public.model_plan (id) MATCH SIMPLE
-- ON UPDATE NO ACTION
-- ON DELETE NO ACTION;
