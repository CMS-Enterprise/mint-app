-- V217__Replace_Solution_Tag_Type.sql

-- 1. Add the new value
ALTER TYPE tag_type ADD VALUE IF NOT EXISTS 'MTO_COMMON_SOLUTION';
COMMIT;

-- 2. Update all data to use the new value
UPDATE tag
SET tag_type = 'MTO_COMMON_SOLUTION'
WHERE tag_type = 'POSSIBLE_SOLUTION';

-- 3. Create a new enum type without the old value
CREATE TYPE tag_type_new AS ENUM (
    'USER_ACCOUNT',
    'MTO_COMMON_SOLUTION'
);

-- 4. Alter the column to use the new enum type
ALTER TABLE tag
ALTER COLUMN tag_type TYPE TAG_TYPE_NEW
USING tag_type::TEXT::TAG_TYPE_NEW;

-- 5. Drop the old enum type
DROP TYPE TAG_TYPE;

-- 6. Rename the new enum type to the original name
ALTER TYPE tag_type_new RENAME TO tag_type;
