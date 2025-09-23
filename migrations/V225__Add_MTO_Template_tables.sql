BEGIN;

-- =========================================================
-- 1) Enum for mto_template.key
-- =========================================================
CREATE TYPE MTO_TEMPLATE_KEY AS ENUM (
    'ACO_AND_KIDNEY_MODELS',
    'EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS',
    'MEDICARE_ADVANTAGE_AND_DRUG_MODELS',
    'STANDARD_CATEGORIES',
    'STATE_AND_LOCAL_MODELS'
);

COMMENT ON TYPE MTO_TEMPLATE_KEY IS 'Logical key/family for a template.';

-- =========================================================
-- 2) mto_template (root)
-- =========================================================
CREATE TABLE IF NOT EXISTS mto_template (
    id           UUID PRIMARY KEY NOT NULL,
    key          MTO_TEMPLATE_KEY NOT NULL,
    name         ZERO_STRING NOT NULL,
    description  ZERO_STRING,

    created_by   UUID NOT NULL REFERENCES user_account(id),
    created_dts  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_template IS
'Top-level MTO (Model Tracking & Operations) template definition. This table stores reusable template structures for MTO milestones, solutions, and categories, which can be referenced or instantiated by model plans throughout the application. Each template defines a set of milestones, solutions, and organizational categories that can be used to standardize and streamline model plan setup and tracking in the MINT application.';

COMMENT ON COLUMN mto_template.id IS 'Unique identifier for the template.';
COMMENT ON COLUMN mto_template.key IS 'Enum identifying the logical template family.';
COMMENT ON COLUMN mto_template.name IS 'Human-readable template name.';
COMMENT ON COLUMN mto_template.description IS 'Optional template description.';
COMMENT ON COLUMN mto_template.created_by IS 'User that created this template.';
COMMENT ON COLUMN mto_template.created_dts IS 'Timestamp when the template was created.';
COMMENT ON COLUMN mto_template.modified_by IS 'User that last modified this template.';
COMMENT ON COLUMN mto_template.modified_dts IS 'Timestamp when the template was last modified.';

SELECT audit.AUDIT_TABLE(
    'public','mto_template','id',NULL,
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]
);

-- =========================================================
-- 3) mto_template_category
--    - Parent/child categories within the same template
--    - "order" controls sibling ordering
-- =========================================================
CREATE TABLE IF NOT EXISTS mto_template_category (
    id                 UUID PRIMARY KEY NOT NULL,
    template_id        UUID NOT NULL REFERENCES mto_template(id) ON DELETE CASCADE,
    name               ZERO_STRING NOT NULL,
    parent_id          UUID NULL REFERENCES mto_template_category(id) ON DELETE SET NULL,
    "order"            INT NOT NULL DEFAULT 0,

    created_by   UUID NOT NULL REFERENCES user_account(id),
    created_dts  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_template_category IS 'Categories within a template; parent_id indicates a subcategory.';

COMMENT ON COLUMN mto_template_category.id IS 'Unique identifier for the template category.';
COMMENT ON COLUMN mto_template_category.template_id IS 'FK to the parent template that owns this category.';
COMMENT ON COLUMN mto_template_category.name IS 'Display name of the category.';
COMMENT ON COLUMN mto_template_category.parent_id IS 'Optional FK to a parent category, forming a hierarchy.';
COMMENT ON COLUMN mto_template_category."order" IS 'Sibling order used for sorting within the same parent.';
COMMENT ON COLUMN mto_template_category.created_by IS 'User that created this category.';
COMMENT ON COLUMN mto_template_category.created_dts IS 'Timestamp when the category was created.';
COMMENT ON COLUMN mto_template_category.modified_by IS 'User that last modified this category.';
COMMENT ON COLUMN mto_template_category.modified_dts IS 'Timestamp when the category was last modified.';

-- Sibling order unique within (template_id, parent_id)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_template_category_order
ON mto_template_category (template_id, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::UUID), "order");

-- Parent must belong to same template
CREATE OR REPLACE FUNCTION ENFORCE_CATEGORY_TEMPLATE_MATCH()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    PERFORM 1
    FROM mto_template_category p
    WHERE p.id = NEW.parent_id
      AND p.template_id = NEW.template_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Parent category (%) must belong to same template (%)', NEW.parent_id, NEW.template_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trg_enforce_category_template_match
AFTER INSERT OR UPDATE ON mto_template_category
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION ENFORCE_CATEGORY_TEMPLATE_MATCH();

SELECT audit.AUDIT_TABLE(
    'public','mto_template_category','id','template_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]
);

-- =========================================================
-- 4) mto_template_milestone
--    - Unique (template_id, mto_common_milestone_id)
--    - Optional category must belong to same template
-- =========================================================
CREATE TABLE IF NOT EXISTS mto_template_milestone (
    id                        UUID PRIMARY KEY NOT NULL,
    template_id               UUID NOT NULL REFERENCES mto_template(id) ON DELETE CASCADE,
    mto_common_milestone_key  MTO_COMMON_MILESTONE_KEY NOT NULL
    REFERENCES mto_common_milestone(key),
    mto_template_category_id  UUID NULL REFERENCES mto_template_category(id) ON DELETE SET NULL,

    created_by   UUID NOT NULL REFERENCES user_account(id),
    created_dts  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_template_milestone IS 'Milestones attached to a template, optionally grouped by a category.';

COMMENT ON COLUMN mto_template_milestone.id IS 'Unique identifier for the template milestone.';
COMMENT ON COLUMN mto_template_milestone.template_id IS 'FK to the template that owns this milestone.';
COMMENT ON COLUMN mto_template_milestone.mto_common_milestone_key IS 'FK to the common milestone catalog (by key).';
COMMENT ON COLUMN mto_template_milestone.mto_template_category_id IS 'Optional FK to group this milestone under a template category.';
COMMENT ON COLUMN mto_template_milestone.created_by IS 'User that created this milestone entry.';
COMMENT ON COLUMN mto_template_milestone.created_dts IS 'Timestamp when the milestone entry was created.';
COMMENT ON COLUMN mto_template_milestone.modified_by IS 'User that last modified this milestone entry.';
COMMENT ON COLUMN mto_template_milestone.modified_dts IS 'Timestamp when the milestone entry was last modified.';

CREATE UNIQUE INDEX IF NOT EXISTS uniq_template_common_milestone
ON mto_template_milestone (template_id, mto_common_milestone_key);

-- Category (if present) must belong to same template
CREATE OR REPLACE FUNCTION ENFORCE_MILESTONE_CATEGORY_TEMPLATE_MATCH()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.mto_template_category_id IS NOT NULL THEN
    PERFORM 1
    FROM mto_template_category c
    WHERE c.id = NEW.mto_template_category_id
      AND c.template_id = NEW.template_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Category (%) must belong to same template (%)', NEW.mto_template_category_id, NEW.template_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trg_enforce_milestone_category_template_match
AFTER INSERT OR UPDATE ON mto_template_milestone
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION ENFORCE_MILESTONE_CATEGORY_TEMPLATE_MATCH();

SELECT audit.AUDIT_TABLE(
    'public','mto_template_milestone','id','template_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]
);

-- =========================================================
-- 5) mto_template_solution
--    - NOTE: FK references enum PK on mto_common_solution(key)
--    - Unique (template_id, mto_common_solution_key)
-- =========================================================
CREATE TABLE IF NOT EXISTS mto_template_solution (
    id                      UUID PRIMARY KEY NOT NULL,
    template_id             UUID NOT NULL REFERENCES mto_template(id) ON DELETE CASCADE,
    mto_common_solution_id  UUID NOT NULL REFERENCES mto_common_solution(id),

    created_by   UUID NOT NULL REFERENCES user_account(id),
    created_dts  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_template_solution IS 'Solutions attached to a template (FK to enum PK mto_common_solution.key).';

COMMENT ON COLUMN mto_template_solution.id IS 'Unique identifier for the template solution.';
COMMENT ON COLUMN mto_template_solution.template_id IS 'FK to the template that owns this solution.';
COMMENT ON COLUMN mto_template_solution.mto_common_solution_id IS 'FK to the common solution catalog (solution id).';
COMMENT ON COLUMN mto_template_solution.created_by IS 'User that created this solution entry.';
COMMENT ON COLUMN mto_template_solution.created_dts IS 'Timestamp when the solution entry was created.';
COMMENT ON COLUMN mto_template_solution.modified_by IS 'User that last modified this solution entry.';
COMMENT ON COLUMN mto_template_solution.modified_dts IS 'Timestamp when the solution entry was last modified.';

CREATE UNIQUE INDEX IF NOT EXISTS uniq_template_common_solution
ON mto_template_solution (template_id, mto_common_solution_id);

SELECT audit.AUDIT_TABLE(
    'public','mto_template_solution','id','template_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]
);

-- =========================================================
-- 6) mto_template_milestone_solution_link
--    - Links a template milestone to a template solution for the same template
-- =========================================================
CREATE TABLE IF NOT EXISTS mto_template_milestone_solution_link (
    id                     UUID PRIMARY KEY NOT NULL,
    template_id            UUID NOT NULL REFERENCES mto_template(id) ON DELETE CASCADE,
    mto_template_solution  UUID NOT NULL REFERENCES mto_template_solution(id) ON DELETE CASCADE,
    mto_template_milestone UUID NOT NULL REFERENCES mto_template_milestone(id) ON DELETE CASCADE,

    created_by   UUID NOT NULL REFERENCES user_account(id),
    created_dts  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_template_milestone_solution_link IS 'Joins template milestones to template solutions for the same template.';

COMMENT ON COLUMN mto_template_milestone_solution_link.id IS 'Unique identifier for the milestone–solution link record.';
COMMENT ON COLUMN mto_template_milestone_solution_link.template_id IS 'FK to the template that owns both sides of this link.';
COMMENT ON COLUMN mto_template_milestone_solution_link.mto_template_solution IS 'FK to the template solution in this link.';
COMMENT ON COLUMN mto_template_milestone_solution_link.mto_template_milestone IS 'FK to the template milestone in this link.';
COMMENT ON COLUMN mto_template_milestone_solution_link.created_by IS 'User that created this link record.';
COMMENT ON COLUMN mto_template_milestone_solution_link.created_dts IS 'Timestamp when the link record was created.';
COMMENT ON COLUMN mto_template_milestone_solution_link.modified_by IS 'User that last modified this link record.';
COMMENT ON COLUMN mto_template_milestone_solution_link.modified_dts IS 'Timestamp when the link record was last modified.';

-- Ensure both sides of the link belong to NEW.template_id
CREATE OR REPLACE FUNCTION ENFORCE_LINK_TEMPLATE_MATCH()
RETURNS TRIGGER AS $$
DECLARE
  sol_tpl UUID;
  ms_tpl  UUID;
BEGIN
  SELECT s.template_id INTO sol_tpl FROM mto_template_solution s WHERE s.id = NEW.mto_template_solution;
  SELECT m.template_id INTO ms_tpl FROM mto_template_milestone m WHERE m.id = NEW.mto_template_milestone;

  IF sol_tpl IS NULL OR ms_tpl IS NULL THEN
    RAISE EXCEPTION 'Referenced solution/milestone not found';
  END IF;

  IF sol_tpl <> NEW.template_id OR ms_tpl <> NEW.template_id THEN
    RAISE EXCEPTION 'All link parts must belong to the same template (%)', NEW.template_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trg_enforce_link_template_match
AFTER INSERT OR UPDATE ON mto_template_milestone_solution_link
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION ENFORCE_LINK_TEMPLATE_MATCH();

SELECT audit.AUDIT_TABLE(
    'public','mto_template_milestone_solution_link','id','template_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]
);

COMMIT;

-- =========================================================
-- 7) model_plan_mto_template_link
--    - Links a model plan to an MTO template with timestamp
-- =========================================================
CREATE TABLE IF NOT EXISTS model_plan_mto_template_link (
    id              UUID PRIMARY KEY NOT NULL,
    model_plan_id   UUID NOT NULL REFERENCES model_plan(id) ON DELETE CASCADE,
    template_id     UUID NOT NULL REFERENCES mto_template(id) ON DELETE RESTRICT,
    applied_date    DATE NOT NULL DEFAULT CURRENT_DATE,

    created_by      UUID NOT NULL REFERENCES user_account(id),
    created_dts     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by     UUID REFERENCES user_account(id),
    modified_dts    TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE model_plan_mto_template_link IS 'Links model plans to MTO templates, tracking when templates were applied.';

COMMENT ON COLUMN model_plan_mto_template_link.id IS 'Unique identifier for the link record.';
COMMENT ON COLUMN model_plan_mto_template_link.model_plan_id IS 'FK to the model plan using this template.';
COMMENT ON COLUMN model_plan_mto_template_link.template_id IS 'FK to the MTO template being applied.';
COMMENT ON COLUMN model_plan_mto_template_link.applied_date IS 'Date when this template was applied to the model.';

-- Index for finding templates by model
CREATE INDEX IF NOT EXISTS idx_model_plan_mto_template_model_id
ON model_plan_mto_template_link (model_plan_id);

-- Index for finding models by template
CREATE INDEX IF NOT EXISTS idx_model_plan_mto_template_template_id
ON model_plan_mto_template_link (template_id);

SELECT audit.AUDIT_TABLE(
    'public','model_plan_mto_template_link','id',NULL,
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{*}'::TEXT[]
);

ALTER TABLE model_plan_mto_template_link 
ADD CONSTRAINT model_plan_mto_template_link_unique 
UNIQUE (model_plan_id, template_id);
