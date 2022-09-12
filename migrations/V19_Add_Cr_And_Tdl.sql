CREATE TABLE cr_and_tdl (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL, --foreign key to model plan
    id_number ZERO_STRING NOT NULL,
    date_initiated TIMESTAMP NOT NULL,
    title ZERO_STRING NOT NULL,
    optional_comments TEXT,

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);
ALTER TABLE cr_and_tdl
ADD CONSTRAINT fk_cr_and_tdl FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;
