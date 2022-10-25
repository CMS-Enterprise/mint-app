CREATE TABLE operational_need (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL, --foreign key to model plan
    need_type INT,
    name_other ZERO_STRING,

    needed BOOLEAN, --null means not answered


    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);
ALTER TABLE operational_need
ADD CONSTRAINT fk_operational_need_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;


ALTER TABLE operational_need
ADD CONSTRAINT fk_need_possible_need FOREIGN KEY (need_type)
REFERENCES public.possible_operational_need (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

ALTER TABLE operational_need
ADD CONSTRAINT unique_need_per_plan UNIQUE (model_plan_id, need_type);

ALTER TABLE operational_need
ADD CONSTRAINT unique_need_name_other_per_plan UNIQUE (model_plan_id, name_other);

ALTER TABLE operational_need
ADD CONSTRAINT need_type_null_if_other CHECK ((need_type IS NULL OR name_other IS NULL) AND NOT (need_type IS NULL AND name_other IS NULL) );


SELECT audit.AUDIT_TABLE('public', 'operational_need', 'id', 'model_plan_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);
