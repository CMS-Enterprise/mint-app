CREATE TYPE  MODEL_VIEW_FILTER AS ENUM (
  'CCW',
  'CMMI',
  'CBOSC',
  'DFSDM',
  'IPC',
  'IDDOC',
  'MDM',
  'OACT',
  'PBG'
);

ALTER TABLE possible_operational_solution
  ADD COLUMN filter_view MODEL_VIEW_FILTER;
