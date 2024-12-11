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

  -- Since we only have one level of depth, we can simply select the current category and its direct children
  SELECT array_agg(id) INTO cat_ids
  FROM mto_category
  WHERE parent_id = OLD.id OR id = OLD.id;

  -- Reassign all milestones that referenced these categories to OLD.parent_id
  UPDATE mto_milestone
  SET mto_category_id = OLD.parent_id
  WHERE mto_category_id = ANY(cat_ids);

  -- Delete all subcategories (direct children), excluding the category currently being deleted
  DELETE FROM mto_category
  WHERE id != OLD.id
    AND id = ANY(cat_ids);

  RETURN OLD; -- Allow the original DELETE to proceed, removing the OLD.id category
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mto_category_before_delete
  BEFORE DELETE ON mto_category
  FOR EACH ROW
EXECUTE FUNCTION rebalance_milestones_before_category_delete();
