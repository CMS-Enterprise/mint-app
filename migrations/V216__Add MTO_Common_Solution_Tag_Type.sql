-- Add the new value to the tag_type enum
ALTER TYPE tag_type ADD VALUE IF NOT EXISTS 'MTO_COMMON_SOLUTION';
COMMIT;
