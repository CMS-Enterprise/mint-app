/* Add Enum for CR or TDL type */
CREATE TYPE CR_TDL_TYPE AS ENUM ('CR', 'TDL');

ALTER TABLE plan_cr_tdl ADD COLUMN type CR_TDL_TYPE NOT NULL;
ALTER TABLE plan_cr_tdl ADD COLUMN date_implemented TIMESTAMP;

/* date_implemented MUST be set IF AND ONLY IF type = CR */
ALTER TABLE plan_cr_tdl ADD CONSTRAINT date_implemented_must_be_set_if_type_is_cr CHECK (
    (type = 'CR' AND date_implemented IS NOT NULL) OR
    (type = 'TDL' AND date_implemented IS NULL)
);
