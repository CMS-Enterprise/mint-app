-- CTAT enums and request infrastructure.

CREATE TYPE CTAT_CONTRACT_TYPE AS ENUM (
    'COST_PLUS_FIXED_FEE',
    'COST_REIMBURSEMENT',
    'FIRM_FIXED_PRICE',
    'INCENTIVE_CONTRACT',
    'TIME_AND_MATERIALS',
    'OTHER'
);

CREATE TYPE CTAT_CONTRACT_ACTIVITY_TYPE AS ENUM (
    'EVALUATION',
    'IMPLEMENTATION',
    'LEARNING',
    'TECHNICAL_ASSISTANCE',
    'OTHER'
);

CREATE TYPE CTAT_REQUEST_URGENCY AS ENUM (
    'HIGH',
    'MEDIUM',
    'LOW'
);

CREATE TYPE CTAT_CMMI_GROUP_OPTION AS ENUM (
    'BSG',
    'LDG',
    'PCMG',
    'PPG',
    'RREG',
    'SCMG',
    'SPHG',
    'OTHER'
);

CREATE TYPE CTAT_CMMI_DIVISION_OPTION AS ENUM (
    'BSG_DBOM',
    'BSG_DCCS',
    'BSG_DSSOS',
    'BSG_DTS',
    'LDG_DMLS',
    'LDG_DAN',
    'PCMG_DAPC',
    'PCMG_DHCPM',
    'PCMG_DSPM',
    'PCMG_DAPM',
    'PCMG_DPM',
    'PPG_DAPMI',
    'PPG_DDA',
    'PPG_DESP',
    'PPG_DPMS',
    'RREG_DHSR',
    'RREG_DPAR',
    'RREG_DSPR',
    'RREG_DRAM',
    'SCMG_DHPI',
    'SCMG_DFR',
    'SCMG_DSI',
    'SCMG_DDI',
    'SPHG_DMPM',
    'SPHG_DHII',
    'SPHG_DPHII',
    'SPHG_DHCD',
    'SPHG_DSBI',
    'OTHER'
);

CREATE TYPE CTAT_HELP_NEEDED_TYPE AS ENUM (
    'CALM_SYSTEM_REQUISITION_SUPPORT',
    'CONTRACT_CHANGE_REQUEST_CCR_PROCESSING',
    'COR_TRANSCRIPT_REVIEW',
    'DEFINING_AND_DOCUMENTING_CONTRACT_REQUIREMENTS',
    'DELIVERABLE_EVALUATION_REVIEW_DER',
    'GUIDANCE_ON_DETERMINATIONS_AND_FINDINGS_DF',
    'GUIDANCE_ON_JUSTIFICATION_AND_APPROVAL_JA',
    'GUIDANCE_ON_MARKET_RESEARCH',
    'GUIDANCE_ON_TEP_MEMBERSHIP_SCORING_REPORTING',
    'INDEPENDENT_GOVERNMENT_COST_ESTIMATE_IGCE_PREPARATION',
    'POST_AWARD_ACTIONS_PAA',
    'REQUEST_FOR_CONTRACT_MEMO_RFC',
    'REQUEST_FOR_INFORMATION_RFI',
    'REQUEST_FOR_PROPOSAL_RFP',
    'REQUEST_FOR_QUOTATION_RFQ',
    'SOW_SOO_PWS_DEVELOPMENT',
    'CONTRACTOR_PERFORMANCE_MANAGEMENT',
    'DATA_USE_AGREEMENT_DUA',
    'DELIVERABLE_EVALUATION_REVIEW_DER_MODIFICATION',
    'DOCUMENTING_AND_SUBMITTING_CPARS',
    'ENTERPRISE_USER_ADMINISTRATION_EUA_JOB_CODES',
    'FOREIGN_NATIONAL_MANAGEMENT_SYSTEM_FNMS',
    'IDENTITY_AND_CREDENTIALING_TOOL_ICT',
    'INVOICE_PROCESSING_PLATFORM_IPP',
    'MAINTAINING_THE_ELECTRONIC_COR_ECOR_FILE',
    'POST_AWARD_ACTIONS_PAA_MODIFICATION',
    'OTHER'
);

-- The audit system stores audited table names in the TABLE_NAME enum rather than raw text.
-- These values must exist before we can register the CTAT tables with audit.AUDIT_TABLE().
--
-- PostgreSQL also does not allow a brand-new enum value to be used in the same transaction
-- where it was added. We follow the existing repo pattern from V209 by committing the enum
-- additions first, then continuing with the rest of the migration.
ALTER TYPE table_name ADD VALUE 'ctat_request';
ALTER TYPE table_name ADD VALUE 'ctat_request_document';
ALTER TYPE table_name ADD VALUE 'ctat_request_model_plan_link';
COMMIT;

-- Stores the last assigned numeric suffix for each human-readable CTAT prefix.
-- This lets us support per-prefix numbering such as CTAT-1, CTAT-2, ABC-1, etc.
CREATE TABLE ctat_request_human_id_counter (
    prefix ZERO_STRING PRIMARY KEY,
    last_number INTEGER NOT NULL CHECK (last_number > 0)
);

COMMENT ON TABLE ctat_request_human_id_counter IS 'Tracks the last assigned human-readable CTAT request number for each prefix.';
COMMENT ON COLUMN ctat_request_human_id_counter.prefix IS 'The human-readable ID prefix, such as CTAT.';
COMMENT ON COLUMN ctat_request_human_id_counter.last_number IS 'The most recently assigned numeric suffix for the prefix.';

-- Assigns the human-readable numeric suffix on insert.
-- If callers do not provide a prefix, we default to CTAT.
-- If callers do not provide a numeric suffix, we atomically create or increment the counter
-- row for that prefix and use the returned value. This keeps numbering unique per prefix.
CREATE FUNCTION assign_ctat_request_human_readable_id() RETURNS TRIGGER AS $body$
BEGIN
    IF NEW.human_readable_id_prefix IS NULL THEN
        NEW.human_readable_id_prefix := 'CTAT';
    END IF;

    IF NEW.human_readable_id_number IS NULL OR NEW.human_readable_id_number < 1 THEN
        INSERT INTO ctat_request_human_id_counter AS counter (
            prefix,
            last_number
        )
        VALUES (
            NEW.human_readable_id_prefix,
            1
        )
        ON CONFLICT (prefix)
        DO UPDATE SET last_number = counter.last_number + 1
        RETURNING last_number INTO NEW.human_readable_id_number;
    END IF;

    RETURN NEW;
END;
$body$ LANGUAGE plpgsql;

CREATE TABLE ctat_request (
    id UUID PRIMARY KEY NOT NULL,
    human_readable_id_prefix ZERO_STRING NOT NULL DEFAULT 'CTAT',
    human_readable_id_number INTEGER NOT NULL CHECK (human_readable_id_number > 0),
    requester UUID NOT NULL REFERENCES public.user_account(id) MATCH SIMPLE,

    cmmi_group CTAT_CMMI_GROUP_OPTION NOT NULL,
    cmmi_group_other ZERO_STRING,
    cmmi_division CTAT_CMMI_DIVISION_OPTION,
    cmmi_division_other ZERO_STRING,

    contract_activity_type CTAT_CONTRACT_ACTIVITY_TYPE,
    contract_activity_type_other ZERO_STRING,
    contract_name ZERO_STRING,
    contract_number ZERO_STRING,
    contract_type CTAT_CONTRACT_TYPE,
    contract_type_other ZERO_STRING,
    type_of_help_needed CTAT_HELP_NEEDED_TYPE[] NOT NULL DEFAULT '{}'::CTAT_HELP_NEEDED_TYPE[],
    type_of_help_needed_other ZERO_STRING,
    describe_help_needed ZERO_STRING NOT NULL,
    request_urgency CTAT_REQUEST_URGENCY NOT NULL,
    date_assistance_needed_by TIMESTAMP WITH TIME ZONE NOT NULL,

    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- The stored display ID is split into prefix + number so we can support future prefixes
    -- without changing the GraphQL contract, which still exposes a single humanReadableID string.
    CONSTRAINT ctat_request_human_readable_id_unique UNIQUE (human_readable_id_prefix, human_readable_id_number),

    -- When the group itself is OTHER, we require free text for the group and disallow division
    -- data entirely. For named groups, the inverse is true: group-other must stay null and a
    -- division choice is required.
    CONSTRAINT ctat_request_cmmi_group_other_check CHECK (
        (
            cmmi_group = 'OTHER'
            AND cmmi_group_other IS NOT NULL
            AND cmmi_division IS NULL
            AND cmmi_division_other IS NULL
        )
        OR
        (
            cmmi_group != 'OTHER'
            AND cmmi_group_other IS NULL
            AND cmmi_division IS NOT NULL
        )
    ),

    -- Division free text is only valid when the selected division is OTHER. If the group is
    -- OTHER then division must be omitted entirely, which is also covered here by the NULL case.
    CONSTRAINT ctat_request_cmmi_division_other_check CHECK (
        (
            cmmi_division = 'OTHER'
            AND cmmi_division_other IS NOT NULL
        )
        OR
        (
            cmmi_division IS NULL
            AND cmmi_division_other IS NULL
        )
        OR
        (
            cmmi_division != 'OTHER'
            AND cmmi_division_other IS NULL
        )
    ),

    -- Enforces the dependent-dropdown behavior in the database. Each named group only accepts
    -- divisions from its own namespace (for example BSG can only store BSG_* or division OTHER).
    -- This keeps invalid cross-group combinations out even if application validation is bypassed.
    CONSTRAINT ctat_request_cmmi_group_division_check CHECK (
        cmmi_group = 'OTHER'
        OR (cmmi_group = 'BSG' AND (cmmi_division::TEXT LIKE 'BSG_%' OR cmmi_division = 'OTHER'))
        OR (cmmi_group = 'LDG' AND (cmmi_division::TEXT LIKE 'LDG_%' OR cmmi_division = 'OTHER'))
        OR (cmmi_group = 'PCMG' AND (cmmi_division::TEXT LIKE 'PCMG_%' OR cmmi_division = 'OTHER'))
        OR (cmmi_group = 'PPG' AND (cmmi_division::TEXT LIKE 'PPG_%' OR cmmi_division = 'OTHER'))
        OR (cmmi_group = 'RREG' AND (cmmi_division::TEXT LIKE 'RREG_%' OR cmmi_division = 'OTHER'))
        OR (cmmi_group = 'SCMG' AND (cmmi_division::TEXT LIKE 'SCMG_%' OR cmmi_division = 'OTHER'))
        OR (cmmi_group = 'SPHG' AND (cmmi_division::TEXT LIKE 'SPHG_%' OR cmmi_division = 'OTHER'))
    ),

    -- Standard OTHER/detail pairing: detail text is required when OTHER is selected and must be
    -- absent otherwise. The NULL branch covers the optional nature of this field.
    CONSTRAINT ctat_request_contract_activity_type_other_check CHECK (
        (
            contract_activity_type = 'OTHER'
            AND contract_activity_type_other IS NOT NULL
        )
        OR
        (
            contract_activity_type IS NULL
            AND contract_activity_type_other IS NULL
        )
        OR
        (
            contract_activity_type != 'OTHER'
            AND contract_activity_type_other IS NULL
        )
    ),

    -- Standard OTHER/detail pairing for contract type.
    CONSTRAINT ctat_request_contract_type_other_check CHECK (
        (
            contract_type = 'OTHER'
            AND contract_type_other IS NOT NULL
        )
        OR
        (
            contract_type IS NULL
            AND contract_type_other IS NULL
        )
        OR
        (
            contract_type != 'OTHER'
            AND contract_type_other IS NULL
        )
    ),

    -- type_of_help_needed is multi-select, so the rule is based on whether OTHER is present in
    -- the enum array. If OTHER is selected, the companion free-text field becomes required.
    CONSTRAINT ctat_request_type_of_help_needed_other_check CHECK (
        (
            'OTHER' = any(type_of_help_needed)
            AND type_of_help_needed_other IS NOT NULL
        )
        OR
        (
            NOT ('OTHER' = any(type_of_help_needed))
            AND type_of_help_needed_other IS NULL
        )
    )
);

-- Runs only on insert so the generated display ID is assigned once. If a future backfill or
-- admin script needs to provide an explicit number, the trigger respects that value.
CREATE TRIGGER ctat_request_human_readable_id_trigger
BEFORE INSERT ON ctat_request
FOR EACH ROW
EXECUTE FUNCTION assign_ctat_request_human_readable_id();

COMMENT ON TABLE ctat_request IS 'A request for CTAT assistance.';
COMMENT ON COLUMN ctat_request.id IS 'Unique identifier for the CTAT request.';
COMMENT ON COLUMN ctat_request.human_readable_id_prefix IS 'Stored prefix portion of the CTAT human-readable ID.';
COMMENT ON COLUMN ctat_request.human_readable_id_number IS 'Stored numeric portion of the CTAT human-readable ID.';
COMMENT ON COLUMN ctat_request.requester IS 'The user who requested CTAT assistance.';
COMMENT ON COLUMN ctat_request.cmmi_group IS 'The selected CMMI group for the request.';
COMMENT ON COLUMN ctat_request.cmmi_group_other IS 'Free-text description when the selected CMMI group is Other.';
COMMENT ON COLUMN ctat_request.cmmi_division IS 'The selected CMMI division for the request.';
COMMENT ON COLUMN ctat_request.cmmi_division_other IS 'Free-text description when the selected CMMI division is Other.';
COMMENT ON COLUMN ctat_request.contract_activity_type IS 'The selected contract activity type.';
COMMENT ON COLUMN ctat_request.contract_activity_type_other IS 'Free-text description when the selected contract activity type is Other.';
COMMENT ON COLUMN ctat_request.contract_name IS 'The related contract name, if one exists.';
COMMENT ON COLUMN ctat_request.contract_number IS 'The related contract number, if one exists.';
COMMENT ON COLUMN ctat_request.contract_type IS 'The selected contract type.';
COMMENT ON COLUMN ctat_request.contract_type_other IS 'Free-text description when the selected contract type is Other.';
COMMENT ON COLUMN ctat_request.type_of_help_needed IS 'The selected help-needed options for the request.';
COMMENT ON COLUMN ctat_request.type_of_help_needed_other IS 'Free-text description when one of the selected help-needed options is Other.';
COMMENT ON COLUMN ctat_request.describe_help_needed IS 'Detailed description of the requested assistance.';
COMMENT ON COLUMN ctat_request.request_urgency IS 'The urgency selected for the request.';
COMMENT ON COLUMN ctat_request.date_assistance_needed_by IS 'The date by which assistance is needed.';
COMMENT ON COLUMN ctat_request.created_by IS 'The user who created the CTAT request.';
COMMENT ON COLUMN ctat_request.created_dts IS 'The timestamp when the CTAT request was created.';
COMMENT ON COLUMN ctat_request.modified_by IS 'The user who last modified the CTAT request.';
COMMENT ON COLUMN ctat_request.modified_dts IS 'The timestamp when the CTAT request was last modified.';

CREATE TABLE ctat_request_document (
    id UUID PRIMARY KEY NOT NULL,
    ctat_request_id UUID NOT NULL REFERENCES public.ctat_request(id) MATCH SIMPLE,
    url ZERO_STRING,
    file_type ZERO_STRING NOT NULL,
    bucket ZERO_STRING NOT NULL,
    file_key ZERO_STRING NOT NULL,
    virus_scanned BOOLEAN NOT NULL DEFAULT FALSE,
    virus_clean BOOLEAN NOT NULL DEFAULT FALSE,
    restricted BOOLEAN NOT NULL DEFAULT FALSE,
    file_name ZERO_STRING NOT NULL,
    file_size INTEGER NOT NULL,
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE ctat_request_document IS 'A supporting document attached to a CTAT request.';
COMMENT ON COLUMN ctat_request_document.id IS 'Unique identifier for the CTAT request document.';
COMMENT ON COLUMN ctat_request_document.ctat_request_id IS 'The CTAT request the supporting document belongs to.';
COMMENT ON COLUMN ctat_request_document.url IS 'Optional URL for retrieving the supporting document.';
COMMENT ON COLUMN ctat_request_document.file_type IS 'The MIME type of the stored document.';
COMMENT ON COLUMN ctat_request_document.bucket IS 'The storage bucket containing the document.';
COMMENT ON COLUMN ctat_request_document.file_key IS 'The storage key for the document.';
COMMENT ON COLUMN ctat_request_document.virus_scanned IS 'Whether the document has been scanned for viruses.';
COMMENT ON COLUMN ctat_request_document.virus_clean IS 'Whether the most recent virus scan marked the document as clean.';
COMMENT ON COLUMN ctat_request_document.restricted IS 'Whether access to the document is restricted.';
COMMENT ON COLUMN ctat_request_document.file_name IS 'The original file name.';
COMMENT ON COLUMN ctat_request_document.file_size IS 'The size of the file in bytes.';
COMMENT ON COLUMN ctat_request_document.created_by IS 'The user who created the CTAT request document record.';
COMMENT ON COLUMN ctat_request_document.created_dts IS 'The timestamp when the CTAT request document record was created.';
COMMENT ON COLUMN ctat_request_document.modified_by IS 'The user who last modified the CTAT request document record.';
COMMENT ON COLUMN ctat_request_document.modified_dts IS 'The timestamp when the CTAT request document record was last modified.';

CREATE TABLE ctat_request_model_plan_link (
    id UUID PRIMARY KEY NOT NULL,
    ctat_request_id UUID NOT NULL REFERENCES public.ctat_request(id) MATCH SIMPLE,
    model_plan_id UUID NOT NULL REFERENCES public.model_plan(id) MATCH SIMPLE,
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    CONSTRAINT ctat_request_model_plan_link_unique UNIQUE (ctat_request_id, model_plan_id)
);

COMMENT ON TABLE ctat_request_model_plan_link IS 'Associates CTAT requests to related MINT model plans.';
COMMENT ON COLUMN ctat_request_model_plan_link.id IS 'Unique identifier for the CTAT request model plan link.';
COMMENT ON COLUMN ctat_request_model_plan_link.ctat_request_id IS 'The CTAT request linked to the related MINT model.';
COMMENT ON COLUMN ctat_request_model_plan_link.model_plan_id IS 'The related MINT model plan.';
COMMENT ON COLUMN ctat_request_model_plan_link.created_by IS 'The user who created the CTAT request model plan link.';
COMMENT ON COLUMN ctat_request_model_plan_link.created_dts IS 'The timestamp when the CTAT request model plan link was created.';
COMMENT ON COLUMN ctat_request_model_plan_link.modified_by IS 'The user who last modified the CTAT request model plan link.';
COMMENT ON COLUMN ctat_request_model_plan_link.modified_dts IS 'The timestamp when the CTAT request model plan link was last modified.';

-- Register the CTAT tables with the existing audit pipeline so inserts/updates/deletes are
-- captured in audit.change and translated audit views. We explicitly include IDs/foreign keys in
-- insert_fields where helpful so initial create events retain enough context to be understandable.
SELECT audit.AUDIT_TABLE(
    'public',
    'ctat_request',
    'id',
    NULL,
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id}'::TEXT[]
);

SELECT audit.AUDIT_TABLE(
    'public',
    'ctat_request_document',
    'id',
    'ctat_request_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,ctat_request_id}'::TEXT[]
);

SELECT audit.AUDIT_TABLE(
    'public',
    'ctat_request_model_plan_link',
    'id',
    'ctat_request_id',
    '{created_by,created_dts,modified_by,modified_dts}'::TEXT[],
    '{*,id,ctat_request_id}'::TEXT[]
);
