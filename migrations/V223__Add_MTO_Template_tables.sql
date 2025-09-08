BEGIN;

-- =========================================================
-- 1) Enum for mto_template.key
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mto_template_key') THEN
    CREATE TYPE MTO_TEMPLATE_KEY AS ENUM ('DEFAULT');
  END IF;
END$$;

-- =========================================================
-- 2) mto_template (root)
-- =========================================================
CREATE TABLE IF NOT EXISTS mto_template (
    id           UUID PRIMARY KEY NOT NULL,
    key          MTO_TEMPLATE_KEY NOT NULL,
    name         TEXT NOT NULL,
    description  TEXT,

    created_by   UUID NOT NULL REFERENCES user_account(id),
    created_dts  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMPTZ
);

COMMENT ON TABLE mto_template IS 'Top-level template definition.';

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
    name               TEXT NOT NULL,
    parent_category_id UUID NULL REFERENCES mto_template_category(id) ON DELETE SET NULL,
    "order"            INT NOT NULL DEFAULT 0,

    created_by   UUID NOT NULL REFERENCES user_account(id),
    created_dts  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMPTZ
);

COMMENT ON TABLE mto_template_category IS 'Categories within a template; parent_category_id indicates a subcategory.';

-- Sibling order unique within (template_id, parent_category_id)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_template_category_order
ON mto_template_category (template_id, COALESCE(parent_category_id, '00000000-0000-0000-0000-000000000000'::UUID), "order");

-- Parent must belong to same template
CREATE OR REPLACE FUNCTION ENFORCE_CATEGORY_TEMPLATE_MATCH()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_category_id IS NOT NULL THEN
    PERFORM 1
    FROM mto_template_category p
    WHERE p.id = NEW.parent_category_id
      AND p.template_id = NEW.template_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Parent category (%) must belong to same template (%)', NEW.parent_category_id, NEW.template_id;
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
    created_dts  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMPTZ
);

COMMENT ON TABLE mto_template_milestone IS 'Milestones attached to a template, optionally grouped by a category.';

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
    mto_common_solution_id UUID NOT NULL REFERENCES mto_common_solution(id),

    created_by   UUID NOT NULL REFERENCES user_account(id),
    created_dts  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMPTZ
);

COMMENT ON TABLE mto_template_solution IS 'Solutions attached to a template (FK to enum PK mto_common_solution.key).';

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
    created_dts  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by  UUID REFERENCES user_account(id),
    modified_dts TIMESTAMPTZ
);

COMMENT ON TABLE mto_template_milestone_solution_link IS 'Joins template milestones to template solutions for the same template.';

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
