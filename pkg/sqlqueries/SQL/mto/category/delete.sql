-- TODO: Move function creation to a migration, keeping it here for testing purposes

/*
    This SQL script sets up a trigger and a supporting function to handle custom cascading
    deletion behavior for categories in the `mto_category` table, per the application requirements.

    Updated Assumption (per user's note):
    -------------------------------------
    Instead of assigning milestones to a designated "Uncategorized" category with a known UUID,
    we will set their `mto_category_id` to NULL (a "nil" UUID), indicating they are now uncategorized.

    Requirements:
    - Deleting a subcategory:
        * All milestones referencing that subcategory should be reassigned to its parent category.
    - Deleting a top-level category:
        * All milestones referencing the deleted top-level category or its direct subcategories
          should have `mto_category_id` set to NULL, indicating they are now uncategorized.
        * All direct subcategories of the deleted category should be deleted.

    Why the "CASCADE" Keyword Isn't Used:
    -------------------------------------
    The standard ON DELETE CASCADE simply removes dependent rows. Here, we need to reassign
    references rather than just delete them. Since this behavior is more complex, we implement
    custom logic in a trigger and a PL/pgSQL function rather than relying on cascade deletes.

    Usage:
    - Once this script is applied, a `DELETE FROM mto_category WHERE id = 'some-category-uuid';`
      will trigger the logic to reassign milestones and remove subcategories as defined.

    Assumptions:
    - When deleting a top-level category, milestones are "uncategorized" by setting their
      `mto_category_id` to NULL.
    - For subcategories, milestones are moved up to the parent category.
    - This handles one level of subcategories. If a deeper hierarchy is required,
      the logic should be extended to recursively handle all descendants.
*/

-- Drop existing trigger and function to allow clean re-creation
DROP TRIGGER IF EXISTS mto_category_before_delete ON mto_category;
DROP FUNCTION IF EXISTS rebalance_milestones_before_category_delete();

-- Create the trigger function that implements the custom cascading logic
CREATE OR REPLACE FUNCTION rebalance_milestones_before_category_delete()
RETURNS TRIGGER AS $$
DECLARE
  cat_model_plan_id UUID;
  is_top_level BOOLEAN;
BEGIN
  -- Determine if the category is top-level or a subcategory
  SELECT model_plan_id, (parent_id IS NULL) INTO cat_model_plan_id, is_top_level
  FROM mto_category
  WHERE id = OLD.id;

  IF is_top_level THEN
    -- TOP-LEVEL CATEGORY DELETION LOGIC:
    -- Reassign all milestones referencing this category or its direct subcategories
    -- to NULL, marking them as uncategorized.

    UPDATE mto_milestone
    SET mto_category_id = NULL
    WHERE mto_category_id IN (
      SELECT id FROM mto_category
      WHERE parent_id = OLD.id
      UNION ALL
      SELECT OLD.id
    );

    -- Delete all direct subcategories of this category
    DELETE FROM mto_category
    WHERE parent_id = OLD.id;

    -- The category itself (OLD.id) will be deleted by the original DELETE statement
  ELSE
    -- SUBCATEGORY DELETION LOGIC:
    -- Move all milestones from this subcategory to its parent category
    UPDATE mto_milestone
    SET mto_category_id = OLD.parent_id
    WHERE mto_category_id = OLD.id;

    -- The subcategory (OLD.id) will be deleted by the original DELETE statement
  END IF;

  RETURN OLD; -- Allow the DELETE to proceed after adjustments
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to invoke the above function before any category deletion
CREATE TRIGGER mto_category_before_delete
BEFORE DELETE ON mto_category
FOR EACH ROW
EXECUTE FUNCTION rebalance_milestones_before_category_delete();


DELETE FROM mto_category
WHERE id = :id
RETURNING
    id,
    name,
    parent_id,
    model_plan_id,
    position,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
