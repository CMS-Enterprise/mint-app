-- Flyway migration V110
ALTER TABLE plan_general_characteristics
  ADD COLUMN existing_model_id UUID NULL,
  ADD CONSTRAINT fk_existing_model
    FOREIGN KEY (existing_model_id)
      REFERENCES model_plan(id)
      ON DELETE SET NULL;

UPDATE plan_general_characteristics pc
SET existing_model_id = (
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