-- Add additional view customization type
ALTER TYPE VIEW_CUSTOMIZATION_TYPE ADD VALUE 'NEWLY_CREATED_MODEL_PLANS';

-- Add new column to user_view_customization table
ALTER TABLE user_view_customization
ADD COLUMN newly_created_model_plans BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN user_view_customization.newly_created_model_plans IS 'This column represents a boolean value that indicates whether the user has selected to view newly created model plans on their home page.';
