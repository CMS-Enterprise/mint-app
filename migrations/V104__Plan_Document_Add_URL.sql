ALTER TABLE plan_document
  ADD COLUMN is_link boolean NOT NULL DEFAULT FALSE,
  ADD COLUMN url zero_string;


ALTER TABLE plan_document
ADD CONSTRAINT url_required_when_is_link_is_true CHECK ( (is_link AND url IS NOT NULL) OR (NOT is_link AND url IS NULL));
