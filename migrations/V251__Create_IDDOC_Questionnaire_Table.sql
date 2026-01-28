-- Create the iddoc_questionnaire table
CREATE TABLE iddoc_questionnaire (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),

    -- Questionnaire fields
    -- Page 1 Operations
    technical_contacts_identified BOOLEAN,
    technical_contacts_identified_detail TEXT,
    technical_contacts_identified_note TEXT,
    capture_participant_info BOOLEAN,
    capture_participant_info_note TEXT,
    icd_owner TEXT,
    draft_icd_due_date TIMESTAMP WITH TIME ZONE, 
    icd_note TEXT,

    -- Page 2 Testing
    uat_needs TEXT,
    stc_needs TEXT,
    testing_timelines TEXT,
    testing_note TEXT,
    data_monitoring_file_types IDDOC_FILE_TYPE[],
    data_monitoring_file_other TEXT,
    data_response_type TEXT,
    data_response_file_frequency TEXT,

    -- Page 3 Monitoring
    data_full_time_or_incremental TEXT,
    eft_set_up BOOLEAN,
    unsolicited_adjustments_included BOOLEAN,
    data_flow_diagrams_needed BOOLEAN,
    produce_benefit_enhancement_files BOOLEAN,
    file_naming_conventions TEXT,
    data_monitoring_note TEXT,

    -- Metadata
    needed BOOLEAN NOT NULL DEFAULT FALSE,
    is_iddoc_questionnaire_complete BOOLEAN NOT NULL DEFAULT FALSE,
    completed_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    completed_dts TIMESTAMP WITH TIME ZONE,

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- Ensure only one IDDOC questionnaire per model plan
    UNIQUE(model_plan_id)
);

-- Add table and column comments
COMMENT ON TABLE iddoc_questionnaire IS 'IDDOC (Integrated Data Distribution and Operations Center) questionnaire for model plans. Tracks technical requirements and setup for data exchange.';
COMMENT ON COLUMN iddoc_questionnaire.id IS 'Unique identifier for the IDDOC questionnaire record.';
COMMENT ON COLUMN iddoc_questionnaire.model_plan_id IS 'The model plan this IDDOC questionnaire is associated with.';
COMMENT ON COLUMN iddoc_questionnaire.technical_contacts_identified IS 'Whether technical contacts have been identified for IDDOC setup.';
COMMENT ON COLUMN iddoc_questionnaire.technical_contacts_identified_detail IS 'Details about the technical contacts that have been identified.';
COMMENT ON COLUMN iddoc_questionnaire.technical_contacts_identified_note IS 'Additional notes about technical contacts identification.';
COMMENT ON COLUMN iddoc_questionnaire.capture_participant_info IS 'Whether participant information will be captured.';
COMMENT ON COLUMN iddoc_questionnaire.capture_participant_info_note IS 'Notes about capturing participant information.';
COMMENT ON COLUMN iddoc_questionnaire.icd_owner IS 'The owner of the Interface Control Document (ICD).';
COMMENT ON COLUMN iddoc_questionnaire.draft_icd_due_date IS 'The date by which a draft ICD is required.';
COMMENT ON COLUMN iddoc_questionnaire.icd_note IS 'Additional notes about the Interface Control Document (ICD).';
COMMENT ON COLUMN iddoc_questionnaire.uat_needs IS 'User Acceptance Testing (UAT) test data needs.';
COMMENT ON COLUMN iddoc_questionnaire.stc_needs IS 'System Test and Certification (STC) test data needs.';
COMMENT ON COLUMN iddoc_questionnaire.testing_timelines IS 'Timelines for testing activities.';
COMMENT ON COLUMN iddoc_questionnaire.testing_note IS 'Additional notes about testing requirements.';
COMMENT ON COLUMN iddoc_questionnaire.data_monitoring_file_types IS 'Types of files that will be exchanged through IDDOC.';
COMMENT ON COLUMN iddoc_questionnaire.data_monitoring_file_other IS 'Description of other file types not covered by the file_types enum.';
COMMENT ON COLUMN iddoc_questionnaire.data_response_type IS 'Types of responses expected from IDDOC.';
COMMENT ON COLUMN iddoc_questionnaire.data_response_file_frequency IS 'Frequency of file exchanges.';
COMMENT ON COLUMN iddoc_questionnaire.data_full_time_or_incremental IS 'Whether data monitoring is full-time or incremental.';
COMMENT ON COLUMN iddoc_questionnaire.eft_set_up IS 'Whether Electronic Funds Transfer (EFT) connectivity setup is needed.';
COMMENT ON COLUMN iddoc_questionnaire.unsolicited_adjustments_included IS 'Whether unsolicited adjustments are included.';
COMMENT ON COLUMN iddoc_questionnaire.data_flow_diagrams_needed IS 'Whether data flow diagrams are needed.';
COMMENT ON COLUMN iddoc_questionnaire.produce_benefit_enhancement_files IS 'Whether benefit enhancement files will be produced.';
COMMENT ON COLUMN iddoc_questionnaire.file_naming_conventions IS 'File naming conventions to be used.';
COMMENT ON COLUMN iddoc_questionnaire.data_monitoring_note IS 'Additional notes about data monitoring setup.';
COMMENT ON COLUMN iddoc_questionnaire.needed IS 'Whether the IDDOC questionnaire is needed for this model plan.';
COMMENT ON COLUMN iddoc_questionnaire.completed_by IS 'The user who completed the questionnaire.';
COMMENT ON COLUMN iddoc_questionnaire.completed_dts IS 'The timestamp when the questionnaire was completed.';
COMMENT ON COLUMN iddoc_questionnaire.created_by IS 'The user who created this IDDOC questionnaire record.';
COMMENT ON COLUMN iddoc_questionnaire.created_dts IS 'The timestamp when this record was created.';
COMMENT ON COLUMN iddoc_questionnaire.modified_by IS 'The user who last modified this record.';
COMMENT ON COLUMN iddoc_questionnaire.modified_dts IS 'The timestamp when this record was last modified.';
COMMENT ON COLUMN iddoc_questionnaire.is_iddoc_questionnaire_complete IS 'Whether the IDDOC questionnaire has been marked as complete';

-- Enable auditing on iddoc_questionnaire table
SELECT audit.AUDIT_TABLE(
    'public',
    'iddoc_questionnaire',
    'id',
    'model_plan_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,model_plan_id}'::TEXT[]
);

-- Insert IDDOC questionnaire records for all existing model plans
INSERT INTO iddoc_questionnaire (
    id,
    model_plan_id,
    needed,
    created_by
)
SELECT
    GEN_RANDOM_UUID() AS id,
    mp.id AS model_plan_id,
    FALSE AS needed,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by -- MINT System Account
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM iddoc_questionnaire iq
    WHERE iq.model_plan_id = mp.id
);
