-- 1. Create the new enum type
CREATE TYPE TAG_TYPE_NEW AS ENUM (
  'USER_ACCOUNT',
  'MTO_COMMON_SOLUTION'
);

-- 2. Update all rows in the tag table to use the new value
UPDATE tag SET tag_type = 'MTO_COMMON_SOLUTION' WHERE tag_type = 'POSSIBLE_SOLUTION';

-- 3. Alter the tag_type column to use the new enum type
ALTER TABLE tag ALTER COLUMN tag_type TYPE TAG_TYPE_NEW USING tag_type::text::TAG_TYPE_NEW;

-- 4. Drop the old enum and rename the new one
DROP TYPE TAG_TYPE;
ALTER TYPE TAG_TYPE_NEW RENAME TO TAG_TYPE;