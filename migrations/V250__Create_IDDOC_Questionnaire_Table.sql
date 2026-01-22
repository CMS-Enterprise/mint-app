-- Create the iddoc_questionnaire table
CREATE TABLE iddoc_questionnaire (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),

    -- Questionnaire fields
    technical_contacts_identified BOOLEAN,
    capture_participant_information BOOLEAN,
    icd_owner TEXT,
    draft_icd_required_by TIMESTAMP WITH TIME ZONE,
    uat_test_data_needs TEXT,
    stc_test_data_needs TEXT,
    testing_timelines TEXT,
    file_types IDDOC_FILE_TYPE[],
    response_types TEXT,
    file_frequency TEXT,
    load_type IDDOC_LOAD_TYPE,
    eft_connectivity_setup BOOLEAN,
    unsolicited_adjustments_included BOOLEAN,
    data_flow_diagrams_needed BOOLEAN,
    produce_benefit_enhancement_files BOOLEAN,
    file_naming_conventions TEXT,

    -- Metadata
    needed BOOLEAN NOT NULL DEFAULT FALSE,
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
COMMENT ON COLUMN iddoc_questionnaire.capture_participant_information IS 'Whether participant information will be captured.';
COMMENT ON COLUMN iddoc_questionnaire.icd_owner IS 'The owner of the Interface Control Document (ICD).';
COMMENT ON COLUMN iddoc_questionnaire.draft_icd_required_by IS 'The date by which a draft ICD is required.';
COMMENT ON COLUMN iddoc_questionnaire.uat_test_data_needs IS 'User Acceptance Testing (UAT) test data needs.';
COMMENT ON COLUMN iddoc_questionnaire.stc_test_data_needs IS 'System Test and Certification (STC) test data needs.';
COMMENT ON COLUMN iddoc_questionnaire.testing_timelines IS 'Timelines for testing activities.';
COMMENT ON COLUMN iddoc_questionnaire.file_types IS 'Types of files that will be exchanged through IDDOC.';
COMMENT ON COLUMN iddoc_questionnaire.response_types IS 'Types of responses expected from IDDOC.';
COMMENT ON COLUMN iddoc_questionnaire.file_frequency IS 'Frequency of file exchanges.';
COMMENT ON COLUMN iddoc_questionnaire.load_type IS 'Type of data load (initial, ongoing, or both).';
COMMENT ON COLUMN iddoc_questionnaire.eft_connectivity_setup IS 'Whether Electronic Funds Transfer (EFT) connectivity setup is needed.';
COMMENT ON COLUMN iddoc_questionnaire.unsolicited_adjustments_included IS 'Whether unsolicited adjustments are included.';
COMMENT ON COLUMN iddoc_questionnaire.data_flow_diagrams_needed IS 'Whether data flow diagrams are needed.';
COMMENT ON COLUMN iddoc_questionnaire.produce_benefit_enhancement_files IS 'Whether benefit enhancement files will be produced.';
COMMENT ON COLUMN iddoc_questionnaire.file_naming_conventions IS 'File naming conventions to be used.';
COMMENT ON COLUMN iddoc_questionnaire.needed IS 'Whether the IDDOC questionnaire is needed for this model plan.';
COMMENT ON COLUMN iddoc_questionnaire.completed_by IS 'The user who completed the questionnaire.';
COMMENT ON COLUMN iddoc_questionnaire.completed_dts IS 'The timestamp when the questionnaire was completed.';
COMMENT ON COLUMN iddoc_questionnaire.created_by IS 'The user who created this IDDOC questionnaire record.';
COMMENT ON COLUMN iddoc_questionnaire.created_dts IS 'The timestamp when this record was created.';
COMMENT ON COLUMN iddoc_questionnaire.modified_by IS 'The user who last modified this record.';
COMMENT ON COLUMN iddoc_questionnaire.modified_dts IS 'The timestamp when this record was last modified.';

-- Enable auditing on iddoc_questionnaire table
SELECT audit.AUDIT_TABLE(
    'public',
    'iddoc_questionnaire',
    'id',
    'model_plan_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,model_plan_id}'::TEXT[]
);
