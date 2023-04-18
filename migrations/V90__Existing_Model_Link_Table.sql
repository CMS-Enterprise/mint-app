CREATE TABLE existing_model_link (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL,
    existing_model_id ZERO_STRING NOT NULL, -- if needed in the future, we can link to an additional source
    -- TODO: perhaps update the data type of the existing model as well? I don't think the id should be a zero string

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);

ALTER TABLE existing_model_link
ADD CONSTRAINT fk_existing_model_model FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;


ALTER TABLE existing_model_link
ADD CONSTRAINT fk_existing_model_existing FOREIGN KEY (existing_model_id)
REFERENCES public.existing_model (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

/* Add constraint requiring that you can only link a model and existing model once*/
ALTER TABLE existing_model_link
ADD CONSTRAINT unique_existing_model_link UNIQUE (model_plan_id, existing_model_id);
