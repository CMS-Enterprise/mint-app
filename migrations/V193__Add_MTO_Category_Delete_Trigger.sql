DROP TRIGGER IF EXISTS mto_category_before_delete ON mto_category;
DROP FUNCTION IF EXISTS rebalance_milestones_before_category_delete();

CREATE OR REPLACE FUNCTION rebalance_milestones_before_category_delete()
  RETURNS TRIGGER AS $$
DECLARE
  cat_ids UUID[];
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN OLD;
  END IF;

  -- Recursively gather all descendant categories, including OLD.id
  WITH RECURSIVE cat_tree AS (
    SELECT id, parent_id
    FROM mto_category
    WHERE id = OLD.id
    UNION ALL
    SELECT c.id, c.parent_id
    FROM mto_category c
           JOIN cat_tree t ON t.id = c.parent_id
  )
  SELECT array_agg(id) INTO cat_ids FROM cat_tree;

  -- Always assign milestones to OLD.parent_id
  -- If OLD.parent_id is NULL, they become uncategorized.
  UPDATE mto_milestone
  SET mto_category_id = OLD.parent_id
  WHERE mto_category_id = ANY(cat_ids);

  -- Delete all descendant categories except the current one
  DELETE FROM mto_category
  WHERE id != OLD.id
    AND id = ANY(cat_ids);

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mto_category_before_delete
  BEFORE DELETE ON mto_category
  FOR EACH ROW
EXECUTE FUNCTION rebalance_milestones_before_category_delete();
