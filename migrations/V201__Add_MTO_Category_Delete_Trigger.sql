DROP TRIGGER IF EXISTS mto_category_before_delete ON mto_category;
DROP FUNCTION IF EXISTS rebalance_milestones_before_category_delete();

CREATE OR REPLACE FUNCTION rebalance_milestones_before_category_delete()
RETURNS TRIGGER AS $$
DECLARE
  cat_ids UUID[];
  extra_levels INT;
  deleted_user_uuid UUID = '00000000-0000-0000-0000-000000000000'; -- default to unknown user
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN OLD;
  END IF;

  BEGIN
    -- we need to use session scope to determine who did this action, because we need to set the user who modifies child rows
    deleted_user_uuid = COALESCE(current_setting('app.current_user',TRUE),'00000000-0000-0000-0000-000000000000'); --Try to get user from variable, if not will default to unknown
  EXCEPTION
    WHEN OTHERS THEN 
      RAISE NOTICE 'there was an issue getting the user id for this delete operation';
      RETURN OLD;
  END;

  -- Collect the category being deleted and its direct children
  SELECT array_agg(id) INTO cat_ids
  FROM mto_category
  WHERE parent_id = OLD.id OR id = OLD.id;

  -- Check if there are any second-level subcategories (grandchildren)
  SELECT COUNT(*) INTO extra_levels
  FROM mto_category gc
         JOIN mto_category c ON c.id = gc.parent_id
  WHERE c.parent_id = OLD.id;

  IF extra_levels > 0 THEN
    RAISE EXCEPTION 'Multiple subcategory levels are not supported by this logic.';
  END IF;

  -- Reassign all milestones that referenced these categories to OLD.parent_id
  UPDATE mto_milestone
  SET mto_category_id = OLD.parent_id,
  modified_by = deleted_user_uuid,
  modified_dts = CURRENT_TIMESTAMP
  WHERE mto_category_id = ANY(cat_ids);

  -- Delete all direct subcategories, excluding the category currently being deleted
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
