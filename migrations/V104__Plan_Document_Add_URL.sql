ALTER TABLE plan_document
  ADD COLUMN is_link boolean NOT NULL DEFAULT FALSE,
  ADD COLUMN url zero_string;
