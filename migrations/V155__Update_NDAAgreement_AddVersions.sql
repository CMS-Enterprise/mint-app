ALTER TABLE nda_agreement
  RENAME COLUMN agreed TO v1_agreed;

ALTER TABLE nda_agreement
  RENAME COLUMN agreed_dts TO v1_agreed_dts;

ALTER TABLE nda_agreement
  ADD COLUMN v2_agreed BOOLEAN NOT NULL default false,
  ADD COLUMN v2_agreed_dts timestamp with time zone;
