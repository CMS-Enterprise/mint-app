CREATE TABLE mto_category (
    id UUID PRIMARY KEY,
    name ZERO_STRING NOT NULL,
    parent_id UUID REFERENCES mto_category(id),
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    position INT NOT NULL,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE mto_category IS
'This table stores categories and subcategories. Categories may be organized hierarchically using the parent_id column, and each category belongs to a specific model plan. Subcategories must have the same model_plan_id as their parent, and category names must be unique within a given model_plan_id and parent_id combination.';

ALTER TABLE mto_category
ADD CONSTRAINT unique_id_model_plan 
UNIQUE (id, model_plan_id);
-- Comment for the composite unique constraint on id and model_plan_id
COMMENT ON CONSTRAINT unique_id_model_plan ON mto_category IS
'Ensures that each category ID is uniquely associated with a specific model_plan_id. This is required for enforcing the parent-child relationship where both the parent_id and model_plan_id must be matched.';


ALTER TABLE mto_category
ADD CONSTRAINT unique_name_model_plan_parent
UNIQUE (name, model_plan_id, parent_id);

-- Comment for the unique constraint on name, model_plan_id, and parent_id
COMMENT ON CONSTRAINT unique_name_model_plan_parent ON mto_category IS
'Ensures that the category name is unique within the same model_plan_id and parent_id combination. Prevents duplicate category names under the same model plan and parent.';

-- Create a partial unique index for name and model_plan_id when parent_id is NULL
CREATE UNIQUE INDEX unique_name_model_plan_when_no_parent
ON mto_category (name, model_plan_id)
WHERE parent_id IS NULL;
-- Comment for the partial unique index
COMMENT ON INDEX unique_name_model_plan_when_no_parent IS
'Ensures that category names are unique within the same model_plan_id when parent_id is NULL. This prevents duplicate top-level categories under the same model plan.';

-- Enforce the same model_plan_id for subcategories
ALTER TABLE mto_category
ADD CONSTRAINT fk_parent_model_plan 
FOREIGN KEY (parent_id, model_plan_id) 
REFERENCES mto_category(id, model_plan_id);

-- Comment for the foreign key constraint enforcing the same model_plan_id for subcategories
COMMENT ON CONSTRAINT fk_parent_model_plan ON mto_category IS
'Ensures that if a category has a parent, the model_plan_id of the category matches the model_plan_id of the parent category.';

COMMENT ON COLUMN mto_category.parent_id IS 'References the parent category. If set, the model_plan_id must match the parent category''s model_plan_id.';
COMMENT ON COLUMN mto_category.model_plan_id IS 'References the model plan associated with this category.';
