-- Add missing fields to iddoc_questionnaire table to match GraphQL schema

ALTER TABLE iddoc_questionnaire
ADD COLUMN technical_contacts_identified_detail TEXT,
ADD COLUMN technical_contacts_identified_note TEXT,
ADD COLUMN capture_participant_info_note TEXT,
ADD COLUMN icd_note TEXT,
ADD COLUMN testing_note TEXT,
ADD COLUMN data_monitoring_file_other TEXT,
ADD COLUMN data_monitoring_note TEXT,
ADD COLUMN data_full_time_or_incremental TEXT;

-- Add column comments
COMMENT ON COLUMN iddoc_questionnaire.technical_contacts_identified_detail IS 'Details about the technical contacts that have been identified.';
COMMENT ON COLUMN iddoc_questionnaire.technical_contacts_identified_note IS 'Additional notes about technical contacts identification.';
COMMENT ON COLUMN iddoc_questionnaire.capture_participant_info_note IS 'Notes about capturing participant information.';
COMMENT ON COLUMN iddoc_questionnaire.icd_note IS 'Additional notes about the Interface Control Document (ICD).';
COMMENT ON COLUMN iddoc_questionnaire.testing_note IS 'Additional notes about testing requirements.';
COMMENT ON COLUMN iddoc_questionnaire.data_monitoring_file_other IS 'Description of other file types not covered by the file_types enum.';
COMMENT ON COLUMN iddoc_questionnaire.data_monitoring_note IS 'Additional notes about data monitoring setup.';
COMMENT ON COLUMN iddoc_questionnaire.data_full_time_or_incremental IS 'Whether data monitoring is full-time or incremental.';
