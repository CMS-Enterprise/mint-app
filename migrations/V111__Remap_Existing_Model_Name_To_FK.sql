-- Adding new columns to the plan_general_characteristics table
ALTER TABLE plan_general_characteristics
  ADD COLUMN existing_model_plan_id UUID NULL,
  ADD COLUMN existing_model_external_id INT NULL;

-- Adding foreign key constraints
ALTER TABLE plan_general_characteristics
  ADD CONSTRAINT fk_existing_model_plan
    FOREIGN KEY (existing_model_plan_id)
      REFERENCES model_plan(id)
      ON DELETE SET NULL;

ALTER TABLE plan_general_characteristics
  ADD CONSTRAINT fk_existing_model_external
    FOREIGN KEY (existing_model_external_id)
      REFERENCES public.existing_model(id)
      ON DELETE SET NULL;

-- Ensuring that existing_model_plan_id and existing_model_external_id are mutually exclusive
ALTER TABLE plan_general_characteristics
  ADD CONSTRAINT plan_general_characteristics_check_exclusive_model_ids CHECK (
      (existing_model_plan_id IS NULL) OR (existing_model_external_id IS NULL)
    );

-- Data migration for existing_model_plan_id
UPDATE plan_general_characteristics pc
SET existing_model_plan_id = (
  SELECT mp.id
  FROM model_plan mp
  WHERE mp.model_name = pc.existing_model
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1
  FROM model_plan mp
  WHERE mp.model_name = pc.existing_model
);

-- Data migration for existing_model_external_id
UPDATE plan_general_characteristics pc
SET existing_model_external_id = (
  SELECT em.id
  FROM public.existing_model em
  WHERE em.model_name = pc.existing_model
  LIMIT 1
)
WHERE NOT EXISTS ( -- Ensuring no conflict with existing_model_plan_id
  SELECT 1
  FROM model_plan mp
  WHERE mp.model_name = pc.existing_model
);