/* Convert column type for existing model to be an int insted of a zero string for performance*/
ALTER TABLE existing_model
ALTER COLUMN id TYPE INT
USING id::INT;


CREATE TABLE existing_model_link (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL, --TODO: make this clear it is the source table
    existing_model_id INT,
    current_model_plan_id UUID,

    --META DATA
    created_by UUID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID,
    modified_dts TIMESTAMP WITH TIME ZONE
);

ALTER TABLE existing_model_link
ADD CONSTRAINT fk_existing_model_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

ALTER TABLE existing_model_link
ADD CONSTRAINT fk_existing_model_current_model FOREIGN KEY (current_model_plan_id)
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
ADD CONSTRAINT unique_existing_model_link_existing UNIQUE (model_plan_id, existing_model_id);

/* Add constraint requiring that you can only link a model and current model once*/
ALTER TABLE existing_model_link
ADD CONSTRAINT unique_existing_model_link_current_model UNIQUE (model_plan_id, current_model_plan_id);

/* Add constraint that requires either existing or current model id*/
ALTER TABLE existing_model_link
ADD CONSTRAINT current_model_plan_id_null_if_existing CHECK ((existing_model_id IS NULL OR current_model_plan_id IS NULL) AND NOT (existing_model_id IS NULL AND current_model_plan_id IS NULL)); -- Can't be a existing model table and current model at the same time. One is required

/* TURN ON AUDITING */
SELECT audit.AUDIT_TABLE('public', 'existing_model_link', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{existing_model_id, current_model_plan_id}'::TEXT[]);
