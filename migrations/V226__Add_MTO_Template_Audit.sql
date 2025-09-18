-- This needs to be part of a separate migration than the definition of the tables to avoid issues with existing data
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'mto_template';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'mto_template_category';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'mto_template_milestone';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'mto_template_solution';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'mto_template_milestone_solution_link';
