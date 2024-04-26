ALTER TABLE nda_agreement
  RENAME COLUMN agreed TO v1_agreed;

ALTER TABLE nda_agreement
  ADD COLUMN v2_agreed BOOLEAN NOT NULL default false;
