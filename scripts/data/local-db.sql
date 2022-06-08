--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12 (Debian 11.12-1.pgdg90+1)
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.discussion_reply DROP CONSTRAINT fk_reply_discussion;
ALTER TABLE ONLY public.plan_participants_and_providers DROP CONSTRAINT fk_participants_and_providers_plan;
ALTER TABLE ONLY public.plan_milestones DROP CONSTRAINT fk_milestones_plan;
ALTER TABLE ONLY public.plan_document DROP CONSTRAINT fk_document_plan;
ALTER TABLE ONLY public.plan_discussion DROP CONSTRAINT fk_discussion_plan;
ALTER TABLE ONLY public.plan_collaborator DROP CONSTRAINT fk_collaborator_plan;
ALTER TABLE ONLY public.plan_general_characteristics DROP CONSTRAINT fk_characteristics_plan;
ALTER TABLE ONLY public.plan_beneficiaries DROP CONSTRAINT fk_beneficiaries_plan;
ALTER TABLE ONLY public.plan_basics DROP CONSTRAINT fk_basics_plan;
DROP TRIGGER collaborator_lead_req_update ON public.plan_collaborator;
DROP TRIGGER collaborator_lead_req_delete ON public.plan_collaborator;
DROP INDEX public.flyway_schema_history_s_idx;
ALTER TABLE ONLY public.plan_collaborator DROP CONSTRAINT unique_collaborator_per_plan;
ALTER TABLE ONLY public.plan_participants_and_providers DROP CONSTRAINT plan_participants_and_providers_pkey;
ALTER TABLE ONLY public.plan_participants_and_providers DROP CONSTRAINT plan_participants_and_providers_model_plan_id_key;
ALTER TABLE ONLY public.plan_milestones DROP CONSTRAINT plan_milestones_pkey;
ALTER TABLE ONLY public.plan_milestones DROP CONSTRAINT plan_milestones_model_plan_id_key;
ALTER TABLE ONLY public.plan_general_characteristics DROP CONSTRAINT plan_general_characteristics_pkey;
ALTER TABLE ONLY public.plan_general_characteristics DROP CONSTRAINT plan_general_characteristics_model_plan_id_key;
ALTER TABLE ONLY public.plan_document DROP CONSTRAINT plan_document_pkey;
ALTER TABLE ONLY public.plan_discussion DROP CONSTRAINT plan_discussion_pkey;
ALTER TABLE ONLY public.plan_collaborator DROP CONSTRAINT plan_collaborator_pkey;
ALTER TABLE ONLY public.plan_beneficiaries DROP CONSTRAINT plan_beneficiaries_pkey;
ALTER TABLE ONLY public.plan_beneficiaries DROP CONSTRAINT plan_beneficiaries_model_plan_id_key;
ALTER TABLE ONLY public.plan_basics DROP CONSTRAINT plan_basics_pkey;
ALTER TABLE ONLY public.plan_basics DROP CONSTRAINT plan_basics_model_plan_id_key;
ALTER TABLE ONLY public.model_plan DROP CONSTRAINT model_plan_pkey;
ALTER TABLE ONLY public.flyway_schema_history DROP CONSTRAINT flyway_schema_history_pk;
ALTER TABLE ONLY public.existing_model DROP CONSTRAINT existing_model_pkey;
ALTER TABLE ONLY public.existing_model DROP CONSTRAINT existing_model_model_name_key;
ALTER TABLE ONLY public.discussion_reply DROP CONSTRAINT discussion_reply_pkey;
DROP TABLE public.plan_participants_and_providers;
DROP TABLE public.plan_milestones;
DROP TABLE public.plan_general_characteristics;
DROP TABLE public.plan_document;
DROP TABLE public.plan_discussion;
DROP TABLE public.plan_collaborator;
DROP TABLE public.plan_beneficiaries;
DROP TABLE public.plan_basics;
DROP TABLE public.model_plan;
DROP TABLE public.flyway_schema_history;
DROP TABLE public.existing_model;
DROP TABLE public.discussion_reply;
DROP FUNCTION public.collaborator_role_check_trigger();
DROP TYPE public.waiver_type;
DROP TYPE public.tri_state_answer;
DROP TYPE public.team_role;
DROP TYPE public.task_status;
DROP TYPE public.selection_method_type;
DROP TYPE public.recruitment_type;
DROP TYPE public.provider_leave_type;
DROP TYPE public.provider_add_type;
DROP TYPE public.participants_type;
DROP TYPE public.participants_id_type;
DROP TYPE public.participant_selection_type;
DROP TYPE public.participant_risk_type;
DROP TYPE public.participant_communication_type;
DROP TYPE public.overlap_type;
DROP TYPE public.model_type;
DROP TYPE public.model_plan_status;
DROP TYPE public.model_category;
DROP TYPE public.key_characteristic;
DROP TYPE public.geography_type;
DROP TYPE public.geography_application;
DROP TYPE public.frequency_type;
DROP DOMAIN public.eua_id;
DROP TYPE public.document_type;
DROP TYPE public.discussion_status;
DROP TYPE public.confidence_type;
DROP TYPE public.cms_center;
DROP TYPE public.cmmi_group;
DROP TYPE public.beneficiaries_type;
DROP TYPE public.authority_allowance;
DROP TYPE public.alternative_payment_model_type;
DROP TYPE public.agreement_type;
--
-- Name: agreement_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.agreement_type AS ENUM (
    'PARTICIPATION',
    'COOPERATIVE',
    'OTHER'
);


ALTER TYPE public.agreement_type OWNER TO postgres;

--
-- Name: alternative_payment_model_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.alternative_payment_model_type AS ENUM (
    'REGULAR',
    'MIPS',
    'ADVANCED'
);


ALTER TYPE public.alternative_payment_model_type OWNER TO postgres;

--
-- Name: authority_allowance; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.authority_allowance AS ENUM (
    'ACA',
    'CONGRESSIONALLY_MANDATED',
    'SSA_PART_B',
    'OTHER'
);


ALTER TYPE public.authority_allowance OWNER TO postgres;

--
-- Name: beneficiaries_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.beneficiaries_type AS ENUM (
    'MEDICARE_FFS',
    'MEDICARE_ADVANTAGE',
    'MEDICARE_PART_D',
    'MEDICAID',
    'DUALLY_ELIGIBLE',
    'DISEASE_SPECIFIC',
    'OTHER',
    'NA'
);


ALTER TYPE public.beneficiaries_type OWNER TO postgres;

--
-- Name: cmmi_group; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.cmmi_group AS ENUM (
    'PATIENT_CARE_MODELS_GROUP',
    'POLICY_AND_PROGRAMS_GROUP',
    'PREVENTIVE_AND_POPULATION_HEALTH_CARE_MODELS_GROUP',
    'SEAMLESS_CARE_MODELS_GROUP',
    'STATE_INNOVATIONS_GROUP',
    'TBD'
);


ALTER TYPE public.cmmi_group OWNER TO postgres;

--
-- Name: cms_center; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.cms_center AS ENUM (
    'CMMI',
    'CENTER_FOR_MEDICARE',
    'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE',
    'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY',
    'CENTER_FOR_PROGRAM_INTEGRITY',
    'OTHER'
);


ALTER TYPE public.cms_center OWNER TO postgres;

--
-- Name: confidence_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.confidence_type AS ENUM (
    'NOT_AT_ALL',
    'SLIGHTLY',
    'FAIRLY',
    'COMPLETELY'
);


ALTER TYPE public.confidence_type OWNER TO postgres;

--
-- Name: discussion_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.discussion_status AS ENUM (
    'ANSWERED',
    'WAITING_FOR_RESPONSE',
    'UNANSWERED'
);


ALTER TYPE public.discussion_status OWNER TO postgres;

--
-- Name: document_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.document_type AS ENUM (
    'CONCEPT_PAPER',
    'POLICY_PAPER',
    'ICIP_DRAFT',
    'MARKET_RESEARCH',
    'OTHER'
);


ALTER TYPE public.document_type OWNER TO postgres;

--
-- Name: eua_id; Type: DOMAIN; Schema: public; Owner: postgres
--

CREATE DOMAIN public.eua_id AS text
	CONSTRAINT check_valid_eua_id CHECK ((VALUE ~ '^[A-Z0-9]{4}$'::text));


ALTER DOMAIN public.eua_id OWNER TO postgres;

--
-- Name: frequency_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.frequency_type AS ENUM (
    'ANNUALLY',
    'BIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'ROLLING',
    'OTHER'
);


ALTER TYPE public.frequency_type OWNER TO postgres;

--
-- Name: geography_application; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.geography_application AS ENUM (
    'PARTICIPANTS',
    'PROVIDERS',
    'BENEFICIARIES',
    'OTHER'
);


ALTER TYPE public.geography_application OWNER TO postgres;

--
-- Name: geography_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.geography_type AS ENUM (
    'STATE',
    'REGION',
    'OTHER'
);


ALTER TYPE public.geography_type OWNER TO postgres;

--
-- Name: key_characteristic; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.key_characteristic AS ENUM (
    'EPISODE_BASED',
    'PART_C',
    'PART_D',
    'PAYMENT',
    'POPULATION_BASED',
    'PREVENTATIVE',
    'SERVICE_DELIVERY',
    'SHARED_SAVINGS',
    'OTHER'
);


ALTER TYPE public.key_characteristic OWNER TO postgres;

--
-- Name: model_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.model_category AS ENUM (
    'ACCOUNTABLE_CARE',
    'DEMONSTRATION',
    'EPISODE_BASED_PAYMENT_INITIATIVES',
    'INIT_MEDICAID_CHIP_POP',
    'INIT__MEDICARE_MEDICAID_ENROLLEES',
    'INIT_ACCEL_DEV_AND_TEST',
    'INIT_SPEED_ADOPT_BEST_PRACTICE',
    'PRIMARY_CARE_TRANSFORMATION',
    'UNKNOWN'
);


ALTER TYPE public.model_category OWNER TO postgres;

--
-- Name: model_plan_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.model_plan_status AS ENUM (
    'PLAN_DRAFT',
    'PLAN_COMPLETE',
    'ICIP_COMPLETE',
    'INTERNAL_CMMI_CLEARANCE',
    'CMS_CLEARANCE',
    'HHS_CLEARANCE',
    'OMB_ASRF_CLEARANCE',
    'CLEARED',
    'ANNOUNCED'
);


ALTER TYPE public.model_plan_status OWNER TO postgres;

--
-- Name: model_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.model_type AS ENUM (
    'VOLUNTARY',
    'MANDATORY',
    'TBD'
);


ALTER TYPE public.model_type OWNER TO postgres;

--
-- Name: overlap_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.overlap_type AS ENUM (
    'YES_NEED_POLICIES',
    'YES_NO_ISSUES',
    'NO'
);


ALTER TYPE public.overlap_type OWNER TO postgres;

--
-- Name: participant_communication_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.participant_communication_type AS ENUM (
    'MASS_EMAIL',
    'IT_TOOL',
    'OTHER',
    'NO_COMMUNICATION'
);


ALTER TYPE public.participant_communication_type OWNER TO postgres;

--
-- Name: participant_risk_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.participant_risk_type AS ENUM (
    'TWO_SIDED',
    'ONE_SIDED',
    'CAPITATION',
    'OTHER'
);


ALTER TYPE public.participant_risk_type OWNER TO postgres;

--
-- Name: participant_selection_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.participant_selection_type AS ENUM (
    'MODEL_TEAM_REVIEW_APPLICATIONS',
    'SUPPORT_FROM_CMMI',
    'CMS_COMPONENT_OR_PROCESS',
    'APPLICATION_REVIEW_AND_SCORING_TOOL',
    'APPLICATION_SUPPORT_CONTRACTOR',
    'BASIC_CRITERIA',
    'OTHER',
    'NO_SELECTING_PARTICIPANTS'
);


ALTER TYPE public.participant_selection_type OWNER TO postgres;

--
-- Name: participants_id_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.participants_id_type AS ENUM (
    'TINS',
    'NPIS',
    'CCNS',
    'OTHER',
    'NO_IDENTIFIERS'
);


ALTER TYPE public.participants_id_type OWNER TO postgres;

--
-- Name: participants_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.participants_type AS ENUM (
    'MEDICARE_PROVIDERS',
    'ENTITIES',
    'CONVENER',
    'MEDICARE_ADVANTAGE_PLANS',
    'STANDALONE_PART_D_PLANS',
    'MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS',
    'STATE_MEDICAID_AGENCIES',
    'MEDICAID_MANAGED_CARE_ORGANIZATIONS',
    'MEDICAID_PROVIDERS',
    'STATES',
    'COMMUNITY_BASED_ORGANIZATIONS',
    'NON_PROFIT_ORGANIZATIONS',
    'COMMERCIAL_PAYERS',
    'OTHER'
);


ALTER TYPE public.participants_type OWNER TO postgres;

--
-- Name: provider_add_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.provider_add_type AS ENUM (
    'PROSPECTIVELY',
    'RETROSPECTIVELY',
    'VOLUNTARILY',
    'MANDATORILY',
    'ONLINE_TOOLS',
    'OTHER',
    'NA'
);


ALTER TYPE public.provider_add_type OWNER TO postgres;

--
-- Name: provider_leave_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.provider_leave_type AS ENUM (
    'VOLUNTARILY_WITHOUT_IMPLICATIONS',
    'AFTER_A_CERTAIN_WITH_IMPLICATIONS',
    'VARIES_BY_TYPE_OF_PROVIDER',
    'NOT_ALLOWED_TO_LEAVE',
    'OTHER',
    'NOT_APPLICABLE'
);


ALTER TYPE public.provider_leave_type OWNER TO postgres;

--
-- Name: recruitment_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.recruitment_type AS ENUM (
    'LOI',
    'RFA',
    'NOFO',
    'OTHER',
    'NA'
);


ALTER TYPE public.recruitment_type OWNER TO postgres;

--
-- Name: selection_method_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.selection_method_type AS ENUM (
    'HISTORICAL',
    'PROSPECTIVE',
    'RETROSPECTIVE',
    'VOLUNTARY',
    'PROVIDER_SIGN_UP',
    'OTHER',
    'NA'
);


ALTER TYPE public.selection_method_type OWNER TO postgres;

--
-- Name: task_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_status AS ENUM (
    'READY',
    'IN_PROGRESS',
    'COMPLETE'
);


ALTER TYPE public.task_status OWNER TO postgres;

--
-- Name: team_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.team_role AS ENUM (
    'MODEL_LEAD',
    'MODEL_TEAM',
    'LEADERSHIP',
    'LEARNING',
    'EVALUATION'
);


ALTER TYPE public.team_role OWNER TO postgres;

--
-- Name: tri_state_answer; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tri_state_answer AS ENUM (
    'YES',
    'NO',
    'TBD'
);


ALTER TYPE public.tri_state_answer OWNER TO postgres;

--
-- Name: waiver_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.waiver_type AS ENUM (
    'FRAUD_ABUSE',
    'PROGRAM_PAYMENT',
    'MEDICAID'
);


ALTER TYPE public.waiver_type OWNER TO postgres;

--
-- Name: collaborator_role_check_trigger(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.collaborator_role_check_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- This is used in a before trigger, so we say <2 to check the existing count
    -- before allowing the change, vs making the change and rolling back
    IF (
        SELECT count(*)
        FROM plan_collaborator
        WHERE team_role = 'MODEL_LEAD' and model_plan_id = OLD.model_plan_id 
    ) <2 THEN
        RAISE EXCEPTION 'There must be at least one MODEL_LEAD assigned to each model plan';
    END IF;
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END
$$;


ALTER FUNCTION public.collaborator_role_check_trigger() OWNER TO postgres;

SET default_tablespace = '';

--
-- Name: discussion_reply; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discussion_reply (
    id uuid NOT NULL,
    discussion_id uuid NOT NULL,
    content text NOT NULL,
    resolution boolean NOT NULL,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone
);


ALTER TABLE public.discussion_reply OWNER TO postgres;

--
-- Name: existing_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.existing_model (
    id integer NOT NULL,
    model_name text NOT NULL,
    stage text NOT NULL,
    number_of_participants text,
    category text,
    authority text,
    description text,
    number_of_beneficiaries_impacted integer,
    number_of_physicians_impacted integer,
    date_began timestamp with time zone,
    date_ended timestamp with time zone,
    states text,
    keywords text,
    url text,
    display_model_summary boolean,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone
);


ALTER TABLE public.existing_model OWNER TO postgres;

--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO postgres;

--
-- Name: model_plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.model_plan (
    id uuid NOT NULL,
    model_name text NOT NULL,
    model_category public.model_category,
    cms_centers public.cms_center[],
    cms_other text,
    cmmi_groups public.cmmi_group[],
    archived boolean DEFAULT false NOT NULL,
    status public.model_plan_status NOT NULL,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone
);


ALTER TABLE public.model_plan OWNER TO postgres;

--
-- Name: plan_basics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_basics (
    id uuid NOT NULL,
    model_plan_id uuid NOT NULL,
    model_type public.model_type,
    problem text,
    goal text,
    test_inventions text,
    note text,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone,
    status public.task_status DEFAULT 'READY'::public.task_status NOT NULL
);


ALTER TABLE public.plan_basics OWNER TO postgres;

--
-- Name: plan_beneficiaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_beneficiaries (
    id uuid NOT NULL,
    model_plan_id uuid NOT NULL,
    beneficiaries public.beneficiaries_type[],
    beneficiaries_other text,
    beneficiaries_note text,
    treat_dual_elligible_different public.tri_state_answer,
    treat_dual_elligible_different_how text,
    treat_dual_elligible_different_note text,
    exclude_certain_characteristics public.tri_state_answer,
    exclude_certain_characteristics_criteria text,
    exclude_certain_characteristics_note text,
    number_people_impacted integer,
    estimate_confidence public.confidence_type,
    confidence_note text,
    beneficiary_selection_method public.selection_method_type[],
    beneficiary_selection_other text,
    beneficiary_selection_note text,
    beneficiary_selection_frequency public.frequency_type,
    beneficiary_selection_frequency_other text,
    beneficiary_selection_frequency_note text,
    beneficiary_overlap public.overlap_type,
    beneficiary_overlap_note text,
    precedence_rules text,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone,
    status public.task_status DEFAULT 'READY'::public.task_status NOT NULL
);


ALTER TABLE public.plan_beneficiaries OWNER TO postgres;

--
-- Name: plan_collaborator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_collaborator (
    id uuid NOT NULL,
    model_plan_id uuid NOT NULL,
    eua_user_id public.eua_id NOT NULL,
    full_name text NOT NULL,
    team_role public.team_role NOT NULL,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone
);


ALTER TABLE public.plan_collaborator OWNER TO postgres;

--
-- Name: plan_discussion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_discussion (
    id uuid NOT NULL,
    model_plan_id uuid NOT NULL,
    content text NOT NULL,
    status public.discussion_status DEFAULT 'UNANSWERED'::public.discussion_status NOT NULL,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone
);


ALTER TABLE public.plan_discussion OWNER TO postgres;

--
-- Name: plan_document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_document (
    id uuid NOT NULL,
    model_plan_id uuid NOT NULL,
    file_type text NOT NULL,
    bucket text NOT NULL,
    file_key text NOT NULL,
    virus_scanned boolean NOT NULL,
    virus_clean boolean NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    document_type public.document_type NOT NULL,
    other_type text,
    optional_notes text,
    deleted_at timestamp with time zone,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone
);


ALTER TABLE public.plan_document OWNER TO postgres;

--
-- Name: plan_general_characteristics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_general_characteristics (
    id uuid NOT NULL,
    model_plan_id uuid NOT NULL,
    is_new_model boolean,
    existing_model text,
    resembles_existing_model boolean,
    resembles_existing_model_which text[],
    resembles_existing_model_how text,
    resembles_existing_model_note text,
    has_components_or_tracks boolean,
    has_components_or_tracks_differ text,
    has_components_or_tracks_note text,
    alternative_payment_model boolean,
    alternative_payment_model_types public.alternative_payment_model_type[],
    alternative_payment_model_note text,
    key_characteristics public.key_characteristic[],
    key_characteristics_other text,
    key_characteristics_note text,
    collect_plan_bids boolean,
    collect_plan_bids_note text,
    manage_part_c_d_enrollment boolean,
    manage_part_c_d_enrollment_note text,
    plan_contact_updated boolean,
    plan_contact_updated_note text,
    care_coordination_involved boolean,
    care_coordination_involved_description text,
    care_coordination_involved_note text,
    additional_services_involved boolean,
    additional_services_involved_description text,
    additional_services_involved_note text,
    community_partners_involved boolean,
    community_partners_involved_description text,
    community_partners_involved_note text,
    geographies_targeted boolean,
    geographies_targeted_types public.geography_type[],
    geographies_targeted_types_other text,
    geographies_targeted_applied_to public.geography_application[],
    geographies_targeted_applied_to_other text,
    geographies_targeted_note text,
    participation_options boolean,
    participation_options_note text,
    agreement_types public.agreement_type[],
    agreement_types_other text,
    multiple_patricipation_agreements_needed boolean,
    multiple_patricipation_agreements_needed_note text,
    rulemaking_required boolean,
    rulemaking_required_description text,
    rulemaking_required_note text,
    authority_allowances public.authority_allowance[],
    authority_allowances_other text,
    authority_allowances_note text,
    waivers_required boolean,
    waivers_required_types public.waiver_type[],
    waivers_required_note text,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone,
    status public.task_status DEFAULT 'READY'::public.task_status NOT NULL
);


ALTER TABLE public.plan_general_characteristics OWNER TO postgres;

--
-- Name: plan_milestones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_milestones (
    id uuid NOT NULL,
    model_plan_id uuid NOT NULL,
    complete_icip timestamp with time zone,
    clearance_starts timestamp with time zone,
    clearance_ends timestamp with time zone,
    announced timestamp with time zone,
    applications_starts timestamp with time zone,
    applications_ends timestamp with time zone,
    performance_period_starts timestamp with time zone,
    performance_period_ends timestamp with time zone,
    wrap_up_ends timestamp with time zone,
    high_level_note text,
    phased_in boolean,
    phased_in_note text,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone,
    status public.task_status DEFAULT 'READY'::public.task_status NOT NULL
);


ALTER TABLE public.plan_milestones OWNER TO postgres;

--
-- Name: plan_participants_and_providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_participants_and_providers (
    id uuid NOT NULL,
    model_plan_id uuid NOT NULL,
    participants public.participants_type[],
    medicare_provider_type text,
    states_engagement text,
    participants_other text,
    participants_note text,
    participants_currently_in_models boolean,
    participants_currently_in_models_note text,
    model_application_level text,
    expected_number_of_participants integer,
    estimate_confidence public.confidence_type,
    confidence_note text,
    recruitment_method public.recruitment_type,
    recruitment_other text,
    recruitment_note text,
    selection_method public.participant_selection_type[],
    selection_other text,
    selection_note text,
    communication_method public.participant_communication_type[],
    communication_note text,
    participant_assume_risk boolean,
    risk_type public.participant_risk_type,
    risk_other text,
    risk_note text,
    will_risk_change boolean,
    will_risk_change_note text,
    coordinate_work boolean,
    coordinate_work_note text,
    gainshare_payments boolean,
    gainshare_payments_track boolean,
    gainshare_payments_note text,
    participants_ids public.participants_id_type[],
    participants_ids_other text,
    participants_ids_note text,
    provider_addition_frequency public.frequency_type,
    provider_addition_frequency_other text,
    provider_addition_frequency_note text,
    provider_add_method public.provider_add_type[],
    provider_add_method_other text,
    provider_add_method_note text,
    provider_leave_method public.provider_leave_type[],
    provider_leave_method_other text,
    provider_leave_method_note text,
    provider_overlap public.overlap_type,
    provider_overlap_hierarchy text,
    provider_overlap_note text,
    created_by public.eua_id NOT NULL,
    created_dts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by public.eua_id,
    modified_dts timestamp with time zone,
    status public.task_status DEFAULT 'READY'::public.task_status NOT NULL
);


ALTER TABLE public.plan_participants_and_providers OWNER TO postgres;

--
-- Data for Name: discussion_reply; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discussion_reply (id, discussion_id, content, resolution, created_by, created_dts, modified_by, modified_dts) FROM stdin;
825db0ea-d62a-4c7b-a4a2-37105bc118d6	e847939b-dda7-48b8-88bc-99442017b0c2	Sure thing! The answer is 42.	t	MINT	2022-06-03 17:41:41.040032+00	\N	\N
\.


--
-- Data for Name: existing_model; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.existing_model (id, model_name, stage, number_of_participants, category, authority, description, number_of_beneficiaries_impacted, number_of_physicians_impacted, date_began, date_ended, states, keywords, url, display_model_summary, created_by, created_dts, modified_by, modified_dts) FROM stdin;
1	Advance Payment ACO Model	No Longer Active	35	Accountable Care	Section 3021 of the Affordable Care Act	The Advance Payment ACO Model provided upfront and monthly payments to 35 ACOs participating in the Medicare Shared Savings Program.	\N	\N	\N	\N	NC,KY,NH,FL,TX,RI,TN,CA,MA,MD,MS,CT,IN,AR,MO,OH,NE	Accountable Care, ACOs, Advance Payment ACO Model, Accountable Care Organizations (ACOs), rural, Medicare, Shared Savings Program, prospective payment	/initiatives/Advance-Payment-ACO-Model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
7	Comprehensive ESRD Care Model	No Longer Active	33	Accountable Care	Section 3021 of the Affordable Care Act	The Comprehensive ESRD Care Model was designed to improve care for beneficiaries with ESRD while lowering Medicare costs.	\N	\N	\N	\N	AL,AZ,CA,DE,FL,GA,IL,IN,LA,MA,MD,MI,MN,MO,NC,NJ,NY,NV,OH,OR,PA,SC,TN,TX,WA	Accountable Care, comprehensive esrd care model, esrd, end-stage renal disease, dialysis, Medicare	/initiatives/comprehensive-ESRD-care/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
21	Medicare Health Care Quality Demonstration	No Longer Active	4	Accountable Care	Section 646 of the Medicare Prescription Drug, Improvement, and Modernization Act of 2003	The Medicare Health Care Quality Demonstration tested major changes to improve quality of care while increasing efficiency across an entire health care system.	\N	\N	\N	\N	\N	Accountable Care, Medicare Health Care Quality Demonstration, Medicare	/initiatives/Medicare-Health-Care-Quality/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
25	Nursing Home Value-Based Purchasing Demonstration	No Longer Active	182	Accountable Care	Section 402 of the Social Security Amendments of 1967 as amended	Nursing Home Value-Based Purchasing Demonstration provided incentive payment awards to participating nursing homes that performed the best or improve the most in terms of quality.	\N	\N	\N	\N	AZ,NY,WI	Accountable Care, Nursing Home Value-Based Purchasing Demonstration, Medicare, Medicaid	/initiatives/Nursing-Home-Value-Based-Purchasing/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
27	Physician Group Practice Transition Demonstration	No Longer Active	6	Accountable Care	Sections 3022 and 3027 of the Affordable Care Act	A precursor to the Medicare Shared Savings Program, the Physician Group Practice Transition Demonstration rewarded groups for efficient and high quality care.	\N	\N	\N	\N	\N	Accountable Care, Shared Savings Program, Medicare, Medicare Physician Group Practice Transition Demonstration, Physician Group Practice Transition Demonstration	/initiatives/Physician-Group-Practice-Transition/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
29	Pioneer ACO Model	No Longer Active	9	Accountable Care	Section 3021 of the Affordable Care Act	The Pioneer ACO Model rewarded groups of health care providers experienced in working together to coordinate care.	\N	\N	\N	\N	MN,MA,AZ,WI,CA,MI,NY	Accountable Care, ACOs, Pioneer ACO Model, Accountable Care Organizations (ACOs), Shared Savings Program, alligned beneficiaries, quality metrics, coordinated care, quality measures, Medicare	/initiatives/Pioneer-ACO-Model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
30	Private, For-Profit Demo Project for the Program of All-Inclusive Care for the Elderly (PACE)	No Longer Active	6	Accountable Care	Section 4804 of the Balanced Budget Act of 1997	This demonstration studied the quality and cost of providing PACE program services under the Medicare and Medicaid Programs.	\N	\N	\N	\N	PA	Accountable Care, Private For-Profit Demo Project for the Program of All-Inclusive Care for the Elderly (PACE), PACE, Medicare	/initiatives/PACE/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
38	Accountable Care Organizations (ACOs): General Information	Not Applicable	\N	Accountable Care	\N	ACOs are groups of clinicians, hospitals, and other health-care providers that choose to come together to deliver coordinated, high-quality care to the Medicare patients they serve.	\N	\N	\N	\N	\N	Accountable Care, ACOs, Accountable Care Organizations (ACOs): General Information, Medicare, coordinated care, managed care, Shared Savings Program, Medicare Shared Savings Program, Pioneer ACO Model, Advance Payment ACO Model	/initiatives/ACO/	\N	MINT	2022-06-07 22:02:13.038154+00	\N	\N
54	ACO Investment Model	No Longer Active	45	Accountable Care	Section 3021 of the Affordable Care Act	The ACO Investment Model tested new pre-payment approaches meant to support Medicare Shared Savings Program ACOs.	\N	\N	\N	\N	CA,OK,MN,KS,MS,WV,TX,KY,ME,NC,FL,IA,WI,IL,MO,MI,NH,VT,OH,PA,WA,AL,SC,GA,SD,OR,MT,ID,WY,TN,SD,NE,NM,CO	ACO Investment Model, Accountable Care Organization, Medicare Shared Savings Program, Advance Payment ACO Model, Pioneer ACO Model, rural areas	/initiatives/ACO-Investment-Model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
59	Next Generation ACO Model	No Longer Active	35	Accountable Care	Section 3021 of the Affordable Care Act	This model allowed provider groups to assume higher levels of financial risk and reward than were available under the Pioneer ACO Model and Shared Savings Program through incentives and support tools.	\N	\N	\N	\N	AZ,CA,DE,FL,IA,ID,IN,LA,MA,MI,MN,NC,NH,NY,RI,TX,UT,VA,VT,WA,WI	Next Generation ACO Model, Accountable Care, Medicare, quality improvement, incentives, care coordination, alternative payment models	/initiatives/Next-Generation-ACO-Model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
76	Vermont All-Payer ACO Model	Ongoing	1	Accountable Care	Section 3021 of the Affordable Care Act	This alternative payment model incentivizes delivery of health care value and quality among significant Vermont payers to transform health care for Vermont's population.	\N	\N	\N	\N	VT	Accountable Care, Vermont All-Payer ACO Model, Medicare, Medicaid, all payer	/initiatives/vermont-all-payer-aco-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
100	Kidney Care Choices (KCC) Model	Accepting Applications, Ongoing	85	Accountable Care	Section 3021 of the Affordable Care Act	This model incentivizes kidney disease prevention, encourage kidney transplantation and offer distinct payment options to further these goals.	\N	\N	\N	\N	\N	Kidney Care Choices (KCC) Model, Kidney Care First (KCF) Option, Comprehensive Kidney Care Contracting (CKCC) Option, Advancing American Kidney Health Executive Order, kidney, kidney transplants, dialysis	/initiatives/kidney-care-choices-kcc-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
109	ACO REACH	Accepting Applications	N/A	Accountable Care	Section 3021 of the Affordable Care Act	The redesigned Model reflects the priorities if the Biden-Harris Administration and responds to feedback from stakeholders and participants. ACO REACH will enable CMS to test an ACO model that can inform the Mediare Shared Savings Program and future models by making important changes to the GPDC Model.	\N	\N	\N	\N	\N	ACO Investment Model, Accountable Care Organization, Medicare Shared Savings Program, Advance Payment ACO Model, Pioneer ACO Model, rural areas	https://innovation.cms.gov/innovation-models/aco-reach	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
19	Medicare Acute Care Episode (ACE) Demonstration	No Longer Active	5	Episode-based Payment Initiatives	Section 646 of the Medicare Prescription Drug, Improvement, and Modernization Act of 2003	The Acute Care Episode (ACE) Demonstration tested the effect of bundling Part A and B payments for episodes of acute care.	\N	\N	\N	\N	\N	Episode-based Payment Initiatives, Bundled Payments for Care Improvement (BPCI), Medicare Acute Care Episode (ACE) Demonstration, Medicare, Value-Based Care Centers	/initiatives/ACE/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
36	Million Hearts	Ongoing	\N	Initiatives to Speed the Adoption of Best Practices	Section 3021 of the Affordable Care Act	Million Hearts is a national initiative to prevent 1 million heart attacks and strokes over five years.	\N	\N	\N	\N	\N	Initiatives to Speed the Adoption of Best Practices, Million Hearts, heart attacks, strokes, cardiovascular disease	/initiatives/Million-Hearts/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
22	Medicare Hospital Gainsharing Demonstration	No Longer Active	2	Episode-based Payment Initiatives	Deficit Reduction Act of 2005 and Section 3027 of the Affordable Care Act	This demonstration tested arrangements between hospitals and physicians designed to govern the utilization of inpatient hospital resources and physician work and improve operational hospital performance with the sharing of remuneration.	\N	\N	\N	\N	\N	Episode-based Payment Initiatives, Medicare Hospital Gainsharing Demonstration, rural, Medicare	/initiatives/Medicare-Hospital-Gainsharing/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
28	Physician Hospital Collaboration Demonstration	No Longer Active	12	Episode-based Payment Initiatives	Section 646 of the Medicare Prescription Drug, Improvement, and Modernization Act of 2003	The Physician Hospital Collaboration Demonstration examined the effects of gainsharing aimed at improving the quality of care being delivered.	\N	\N	\N	\N	NJ	Episode-based Payment Initiatives, Physician Hospital Collaboration Demonstration, Medicare	/initiatives/Physician-Hospital-Collaboration/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
39	Bundled Payments for Care Improvement (BPCI) Initiative: General Information	Not Applicable	\N	Episode-based Payment Initiatives	\N	The Bundled Payments for Care Improvement intitiative evaluates 4 different models of bundled payments for a defined episode of care to incentivize care redesign.	\N	\N	\N	\N	\N	Episode-based Payment Initiatives, Bundled Payments for Care Improvement (BPCI) Initiative: General Information, BPCI, Medicare, prospective payment, BPCI Model 1: Retrospective Acute Care Hospital Stay Only, BPCI Model 2: Retrospective Acute & Post Acute Care Episode, BPCI Model 3: Retrospective Post Acute Care, BPCI Model 4: Prospective Acute Care Hospital Stay Only	/initiatives/Bundled-Payments/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
45	Specialty Practitioner Payment Model Opportunities: General Information	Ongoing	\N	Episode-based Payment Initiatives	Section 3021 of the Affordable Care Act	The Centers for Medicare & Medicaid Services (CMS) are seeking input on two areas related to initiatives surrounding innovative models of payment for specialty care.	\N	\N	\N	\N	\N	Episode-based Payment Initiatives, Specialty Practitioner Payment Model Opportunities, Medicare, Medicaid, Children'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢s Health Insurance Program, CHIP, chronic conditions, managed care, outpatient	/initiatives/Specialty-Practitioner/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
56	Oncology Care Model	Ongoing	126 practices, 5 payers	Episode-based Payment Initiatives	Section 3021 of the Affordable Care Act	This innovative new payment model for physician practices administering chemotherapy aims to provide higher quality, more coordinated oncology care at lower cost to Medicare.	\N	\N	\N	\N	AL,AR,AZ,CA,CT,FL,GA,IL,IN,KY,MA,ME,MI,MN,MS,NE,NJ,NM,NY,OH,OK,OR,PA,SC,TN,TX,UT,VA,WA,WI,WV	Oncology Care Model, chemotherapy, care coordination, shared decision making, Medicare, Medicare Advantage, Medicaid	/initiatives/Oncology-Care/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
62	Comprehensive Care for Joint Replacement Model	Ongoing	Approximately 324 hospitals in 34 MSAs	Episode-based Payment Initiatives	Section 3021 of the Affordable Care Act	This model aims to improve care and reduce costs for hip and knee replacements through episode-based payments.	\N	\N	\N	\N	AL,AR CA,CT,FL,GA,IL,IN,KS,KY,LA,MI,MO,NC,NE,NM,NY,ND,OH,OK,PA,SC,TN,TX,UT,WA,WI	Comprehensive Care for Joint Replacement Model, Episode-based Payment Initiatives, lower extremity joint replacement, hip replacement, knee replacement, surgeries	/initiatives/ccjr/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
88	BPCI Advanced	Ongoing	1707	Episode-based Payment Initiatives	Section 3021 of the Affordable Care Act	BPCI Advanced is a voluntary episode payment model that will qualify as an Advanced Alternative Payment Model (APM) under the Quality Payment Program to test a new iteration of bundled payments.	\N	\N	\N	\N	AK,AL,AR,AZ,CA,CO,CT,DC,DE,FL,GA,IA,IL,KS,KY,LA,ME,MD,MI,MN,MO,MS,MT,NC,ND,NE,NJ,NM,NV,NY,OK,OR,PA,PR,SC,SD,TN,TX,UT,VA,WA,WI,WV	Episode-based Payment Initiatives, BPCI Advanced, Bundled Payments for Care Improvement Advanced, Advanced Alternative Payment Model (APM), episode of care, Medicare	/initiatives/bpci-advanced/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
991	ESRD Treatment Choices (ETC) Model	Ongoing	\N	Episode-based Payment Initiatives	Section 3021 of the Affordable Care Act	Encourages greater use of home dialysis and kidney transplants for Medicare beneficiaries with ESRD, while reducing Medicare expenditures and preserving or enhancing the quality of care furnished to beneficiaries with ESRD.	\N	\N	\N	\N	\N	ESRD Treatment Choices (ETC) Model, end-stage renal disease, kidney, Advancing American Kidney Health Executive Order, ETC Model, dialysis, kidney transplants	/initiatives/esrd-treatment-choices-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
101	Radiation Oncology Model	Announced	\N	Episode-based Payment Initiatives	Section 3021 of the Affordable Care Act	This proposed model aims to improve quality of radiotherapy treatments for cancer patients and reduce provider burden through a predictable payment system.	\N	\N	\N	\N	\N	Radiation Oncology Model, radiotherapy, RO Model, radiation oncology, Advanced Alternative Payment Model, MIPS APM	/initiatives/radiation-oncology-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
17	Medicaid Emergency Psychiatric Demonstration	No Longer Active	12	Initiatives Focused on the Medicaid and CHIP Population	Section 2707 of the Affordable Care Act	The Medicaid Emergency Psychiatric Demonstration supported treatment for psychiatric emergencies at private psychiatric hospitals in 11 states and the District of Columbia.	\N	\N	\N	\N	AL,CA,CT,DC,IL,ME,MD,MO,NC,RI,WA,WV	Initiatives Focused on the Medicaid and CHIP Population, Medicaid Emergency Psychiatric Demonstration, Medicaid, Children's Health Insurance Program (CHIP)	/initiatives/Medicaid-Emergency-Psychiatric-Demo/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
18	Medicaid Incentives for the Prevention of Chronic Diseases Model	No Longer Active	10	Initiatives Focused on the Medicaid and CHIP Population	Section 4108 of the Affordable Care Act	The Medicaid Incentives for the Prevention of Chronic Diseases Model supported 10 states providing incentives for Medicaid beneficiaries to participate in prevention programs and demonstrate changes in health risks and outcomes.	\N	\N	\N	\N	WI,MN,NY,NV,NH,MT,HI,TX,CA,CT	Initiatives Focused on the Medicaid and CHIP Population, Medicaid Incentives for the Prevention of Chronic Diseases Model, grants, managed care	/initiatives/MIPCD/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
35	Strong Start for Mothers and Newborns Initiative: Enhanced Prenatal Care Models	No Longer Active	182	Initiatives Focused on the Medicaid and CHIP Population	Section 3021 of the Affordable Care Act	This initiative tested three evidence-based maternity care service approaches that aimed to improve the health outcomes of pregnant women and newborns.	\N	\N	\N	\N	AK,AL,AR,AZ,CA,CT,DC,FL,GA,IL,KY,LA,MD,MI,MN,MO,MS,MT,NC,NE,NJ,NM,NV,NY,OK,OR,PA,PR,SC,TN,TX,VA,WI,WV	Strong Start for Mothers and Newborns Initiative, Initiatives Focused on the Medicaid and CHIP Population, Medicaid, Children's Health Insurance Program (CHIP)	/initiatives/Strong-Start-Strategy-2/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
40	Strong Start for Mothers and Newborns Initiative: Effort to Reduce Early Elective Deliveries	No Longer Active	\N	Initiatives Focused on the Medicaid and CHIP Population	Section 3021 of the Affordable Care Act	The Strong Start effort to reduce early elective deliveries supported providers and mothers-to-be in their efforts to decrease the number of early elective deliveries and improve outcomes for mothers and infants.	\N	\N	\N	\N	\N	Strong Start for Mothers and Newborns Initiative, Initiatives Focused on the Medicaid and CHIP Population, Medicaid, Children's Health Insurance Program (CHIP), Partnership for Patients	/initiatives/Strong-Start-Strategy-1/	f	MINT	2022-06-07 22:02:13.038154+00	\N	\N
41	Strong Start for Mothers and Newborns Initiative: General Information	Not Applicable	\N	Initiatives Focused on the Medicaid and CHIP Population	\N	Strong Start supports reducing elective deliveries prior to 39 weeks and offers enhanced prenatal care to decrease preterm births through awards to 27 organizations.	\N	\N	\N	\N	\N	Initiatives Focused on the Medicaid and CHIP Population, Strong Start for Mothers and Newborns Initiative, Medicaid, Children's Health Insurance Program (CHIP), Partnership for Patients	/initiatives/Strong-Start/	\N	MINT	2022-06-07 22:02:13.038154+00	\N	\N
51	Medicaid Innovation Accelerator Program	No Longer Active	\N	Initiatives Focused on the Medicaid and CHIP Population	Section 3021 of the Affordable Care Act	This program aimed to support state efforts to accelerate innovations to improve health and care, while decreasing costs in the Medicaid and CHIP programs.	\N	\N	\N	\N	AK,AL,AR,AZ,CA,CT,CO,DC,DE,FL,GA,GU,IA,IL,KS,KY,LA,MD,ME,MI,MN,MO,MP,MS,MT,NC,NH,ND,NE,NJ,NM,NV,NY,OK,OR,PA,PR,SC,SD,TN,TX,UT,VA,VT,WA,WI,WV,WY	Initiatives Focused on the Medicaid and CHIP Population, Medicaid, CHIP, Medicaid Innovation Accelerator Program, IAP, technical assistance, CMCS	/initiatives/MIAP/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
85	Pediatric Alternative Payment Model Opportunities: General Information	Under Development	\N	Initiatives Focused on the Medicaid and CHIP Population	Section 3021 of the Affordable Care Act	The Centers for Medicare and Medicaid Services is seeking input on the design of alternative payment models focused on improving the health of children and youth covered by Medicaid and Children's Health Insurance Program (CHIP).	\N	\N	\N	\N	\N	Pediatric Alternative Payment Model Opportunities: General Information, alternative payment models, APM, pediatric, Medicaid, Children's Health Insurance Program (CHIP), Center for Medicaid and Chip Services (CMCS)	/initiatives/pediatric-apm/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
91	Integrated Care for Kids (InCK) Model	Participants Announced	7	Initiatives Focused on the Medicaid and CHIP Population	Section 1115A of the Social Security Act	This model aims to reduce expenditures and improve the quality of care for children covered by Medicaid and the Children's Health Insurance Program (CHIP) through prevention, early identification, and treatment of behavioral and physical health needs, including substance use.	\N	\N	\N	\N	CT,IL,NC,NJ,NY,OH	Integrated Care for Kids (InCK) Model, InCK Model, Medicaid, ChildrenÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢s Health Insurance Program (CHIP), substance use, pediatrics	/initiatives/integrated-care-for-kids-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
93	Maternal Opioid Misuse (MOM) Model	Ongoing	8	Initiatives Focused on the Medicaid and CHIP Population	Section 1115A of the Social Security Act	This model addresses the need to better align and coordinate care of pregnant and postpartum Medicaid beneficiaries with opioid use disorder (OUD) through state-driven transformation of the delivery system.	\N	\N	\N	\N	CO,IN,ME,MD,NH,TN,TX,WV	Maternal Opioid Misuse (MOM) Model, Initiatives Focused on the Medicare-Medicaid Enrollees, opioid, opioid use disorder (oud), Medicaid, pregnant, prenatal, peripartum, postpartum, ChildrenÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢s Health Insurance Program (CHIP), pediatrics	https://innovation.cms.gov/initiatives/maternal-opioid-misuse-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
9	Financial Alignment Initiative for Medicare-Medicaid Enrollees	Ongoing	13	Initiatives Focused on the Medicare-Medicaid Enrollees	Section 3021 of the Affordable Care Act	Enables states to integrate care and payment systems for Medicare-Medicaid enrollees and better coordinate their care.	\N	\N	\N	\N	MA,WA,OH,IL,CA,VA,NY,SC,RI,MN,CO,MI,TX	Initiatives Focused on the Medicare-Medicaid Enrollees, Financial Alignment Initiative, dual eligibles, Medicare, Medicaid, Medicare-Medicaid enrollees, Financial Alignment Initiative for Medicare-Medicaid Enrollees	/initiatives/Financial-Alignment/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
15	Initiative to Reduce Avoidable Hospitalizations Among Nursing Facility Residents	No Longer Active	7	Initiatives Focused on the Medicare-Medicaid Enrollees	Section 3021 of the Affordable Care Act	Offered enhanced clinical services to beneficiaries in extended-care nursing facilities.	\N	\N	\N	\N	AL,IN,MO,NE,NV,NY,PA	Initiatives Focused on the Medicare-Medicaid Enrollees, Initiative to Reduce Avoidable Hospitalizations Among Nursing Facility Residents, Partnership for Patients, Medicare-Medicaid enrollees, dual eligibles, Medicaid, Medicare	/initiatives/rahnfr/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
68	Initiative to Reduce Avoidable Hospitalizations Among Nursing Facility Residents: Phase Two	Ongoing	247	Initiatives Focused on the Medicare-Medicaid Enrollees	Section 3021 of the Affordable Care Act	Phase Two of the Initiative offering enhanced clinical services to beneficiaries in long-term care facilities.	\N	\N	\N	\N	AL,CO,IN,MO,NV,NY,PA	Initiative to Reduce Avoidable Hospitalizations among Nursing Facility Residents: Phase Two, Initiatives Focused on the Medicare-Medicaid Enrollees, dual eligible, Medicare, Medicaid, long-term care (LTC)	/initiatives/rahnfr-phase-two/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
13	Health Care Innovation Awards	No Longer Active	107	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The Health Care Innovation Awards funded competitive grants to compelling new ideas that deliver health care at lower costs to people enrolled in Medicare, Medicaid, and CHIP.	\N	\N	\N	\N	MA,TX,NJ,MN,SD,NC,GA,PA,OR,MD,VA,DC,RI,CT,VT,NM,WA,CA,NH,NE,IL,NY,OH,CO,TN,MI,WI,DE,AR,MO,SC,FL,HI,MT,WY,UT,ID,ME,IA,OK,AZ,IN,ND,AK,NV,ND,AL,PR,OR,KS,KY,MS,WV,ID,LA	Health Care Innovation Awards, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Medicare, Medicaid, Children's Health Insurance Program (CHIP), CHIP, grants, HCIA, Challenge, managed care, community health, rural	/initiatives/Health-Care-Innovation-Awards/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
31	Rural Community Hospital Demonstration	Ongoing	28	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Sections 410A of the Medicare Modernization Act of 2003 as amended by sections 3123 and 10313 of the Affordable Care Act, and section 15003 of the 21st Century Cures Act	The Rural Community Hospital Demonstration is testing the feasibility and advisability of providing reasonable cost reimbursements for small rural hospitals.	\N	\N	\N	\N	AK,CO,IA,KS,ME,MS,NM,OK,SD,NE,WY	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Rural Community Hospital Demonstration, Medicare, rural	/initiatives/Rural-Community-Hospital/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
32	State Innovation Models Initiative: Model Design Awards Round One	Ongoing	16	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	Sixteen states received funding to develop state-based models for multi-payer payment and health care delivery system transformation.	\N	\N	\N	\N	OH,DE,HI,RI,TX,CA,IA,ID,TN,MD,CT,NH,PA,UT,MI,IL	State Innovation Models Initiative, State Innovation Models Initiative: Model Design Awards, State Innovation Models Initiative: Model Design Awards Round One, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	/initiatives/State-Innovations-Model-Design/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
33	State Innovation Models Initiative: Model Pre-Test Awards	No Longer Active	3	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	Three states further developed their state-based models for multi-payer payment reform and health care delivery system transformation.	\N	\N	\N	\N	CO,NY,WA	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, State Innovation Models Initiative: Model Pre-Testing Awards, State Innovation Models Initiative	/initiatives/State-Innovations-Model-Pre-Testing/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
34	State Innovation Models Initiative: Model Test Awards Round One	Ongoing	6	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	Six states are implementing, testing, and evaluating a multi-payer health system transformation model that aims to deliver high quality care and improve health system performance for its residents.	\N	\N	\N	\N	AR,ME,MA,MN,OR,VT	State Innovation Models Initiative, State Innovation Models Initiative: Model Test Awards, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	/initiatives/State-Innovations-Model-Testing/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
37	State Innovation Models Initiative: General Information	Not Applicable	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	\N	The State Innovation Models initiative is a $275 million competitive funding opportunity for States to design and test multi-payer payment and delivery models that deliver high-quality health care and improve health system performance.	\N	\N	\N	\N	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Medicare, Medicaid, Children's Health Insurance Program (CHIP), CHIP, community health, Model Testing, Model Design, grants, State Innovation Models Initiative	/initiatives/State-Innovations/	\N	MINT	2022-06-07 22:02:13.038154+00	\N	\N
42	Medicare Intravenous Immune Globulin (IVIG) Demonstration	Accepting Applications, Ongoing	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Medicare IVIG Access and Strengthening Medicare and Repaying Taxpayers Act of 2012	This Demonstration is being implemented to evaluate the benefits of providing payment and items for services needed for in-home administration of intravenous immune globulin for the treatment of primary immune deficiency disease (PIDD).	\N	\N	\N	\N	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Medicare Intravenous Immune Globulin (IVIG) Demonstration, IVIG, primary immune deficiency disease (PIDD), home health	/initiatives/IVIG/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
43	Maryland All-Payer Model	Ongoing	1	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	This Model is a partnership between CMS and the state of Maryland to modernize Maryland's unique all-payer rate-setting system for hospital services.	\N	\N	\N	\N	MD	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Maryland All-Payer Model, Medicare, Medicaid, Children's Health Insurance Program (CHIP), states	/initiatives/Maryland-All-Payer-Model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
44	Frontier Community Health Integration Project Demonstration	Extension Authorized	10	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3126 of the Affordable Care Act	This demonstration aimed to develop and test new models of integrated, coordinated health care in the most sparsely populated rural counties.	\N	\N	\N	\N	MT,NV,ND	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Frontier Community Health Integration Project Demonstration, Medicare, critical access hospitals (CAHs), rural, telemedicine, home health, home-based care, ambulance, remote geographic areas	/initiatives/Frontier-Community-Health-Integration-Project-Demonstration/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
58	Health Care Payment Learning and Action Network	Ongoing	\N	Initiatives to Speed the Adoption of Best Practices	Section 3021 of the Affordable Care Act	The Health Care Payment Learning and Action Network aims to advance cross-sector work to increase adoption of value-based and alternative payment models.	\N	\N	\N	\N	\N	Health Care Payment Learning and Action Network, Initiatives to Speed the Adoption of Best Practices, value-based payments, alternative payment models, payment reform, alternative payment models	/initiatives/Health-Care-Payment-Learning-and-Action-Network/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
47	Medicare Care Choices Model	No Longer Active	82	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The Medicare Care Choices Model aimed to develop innovative payment systems to improve care options for hospice eligible beneficiaries by allowing greater beneficiary access to comfort and rehabilitative care in Medicare and Medicaid.	\N	\N	\N	\N	CA,CO,DE,FL,GA,HI,IA,ID,IL,IN,KS,KY,OH,OK,MA,MD,MI,MN,MO,MT,NC,NJ,NV,NY,PA,SC,SD,TN,TX,UT,VA,VT,WA,WI	Initiatives to Accelerate the Development and Testing of New payment and Service Delivery Models, Medicare Care Choices Model, hospice, Medicare, Medicaid, curative treatment, dual eligible individuals, Medicare hospice benefit, Medicaid hospice benefit, shared decision making, care coordination	/initiatives/Medicare-Care-Choices/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
48	Health Care Innovation Awards Round Two	No Longer Active	39	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The Health Care Innovation Awards Round Two are funding competitive grants to compelling new ideas that deliver health care at lower costs to people enrolled in Medicare, Medicaid, and CHIP.	\N	\N	\N	\N	AZ,CA,CO,CT,DC,FL,GA,IA,IL,KS,MA,MD,MI,MN,MO,NE,NC,NH,NM,NY,OH,PA,SD,TX,WA,WI,VA	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Health Care Innovation Awards Round Two, HCIA Round Two, grants	/initiatives/Health-Care-Innovation-Awards/Round-2.html	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
49	State Innovation Models Initiative: Model Test Awards Round Two	Ongoing	11	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The second round of State Innovation Models Initiative Model Testing Awards will provide financial and technical support over a four-year period for states to test and evaluate multi-payer health system transformation models.	\N	\N	\N	\N	CO,CT,DE,ID,IA,MI,NY,OH,RI,TN,WA	State Innovation Models Initiative, State Innovation Models Initiative: Model Test Awards Round Two, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	/innovation-models/state-innovations-round-two	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
50	State Innovation Models Initiative: Model Design Awards Round Two	Ongoing	21	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The second round of State Innovation Models Initiative Model Design Awards will provide financial and technical support to states for their planning and design efforts.	\N	\N	\N	\N	AS,AZ,CA,DC,HI,KY,IL,MD,MT,NV,NH,NJ,NM,MP,OK,PA,PR,UT,VA,WV,WI	State Innovation Models Initiative, State Innovation Models Initiative: Model Design Awards Round Two, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	/initiatives/State-Innovations-Model-Design-Round-Two/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
53	Health Plan Innovation Initiatives	Under Development	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The Centers for Medicare and Medicaid Services is seeking input on potential models to test model designs, network designs and incentives in Medicare, Medicaid, Medigap and retiree Supplemental health plans.	\N	\N	\N	\N	\N	Health Plan Innovation Initiatives, Medicare, Medicaid, CHIP, Childrens Health Insurance Plan, Medigap, Medicare Advantage, Retiree Supplemental Health Plans, HPI, Part D	/initiatives/HPI/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
55	State Innovation Models Initiative: Round Two	Ongoing	32	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The second round of State Innovation Models Initiative awards is providing over $665 million to support state-led, multi-payer health care payment and service delivery innovation.	\N	\N	\N	\N	AS,AZ,CA,CO,CT,DC,DE,IA,ID,IL,KY,MD,MI,MP,MT,NH,NM,NJ,NV,NY,OH,OK,PA,PR,RI,TN,UT,VA,WA,WI,WV	State Innovation Models Initiative, State Innovation Models Initiative: Round Two, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	/initiatives/State-Innovations-Round-Two/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
60	Medicare Demonstrations	Ongoing	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	\N	The Center for Medicare & Medicaid Innovation (CMMI) conducts both demonstration projects and model tests to measure the effect of potential program changes. CMMI also sponsors demonstration projects and model tests conducted by other components at the Centers for Medicare & Medicaid Services.	\N	\N	\N	\N	\N	Medicare Demonstrations, Treatment of Certain Complex Diagnostic Laboratory Tests, Electronic Health Records Demonstration, Home Health Pay for Performance Demonstration, Medicare Medical Home Demonstration, Medicare Part D Payment Demonstration, Post Acute Care Payment Reform Demonstration, Medicare Low Vision Rehabilitation Demonstration, Medicare Care Management Performance Demonstration, Senior Risk Reduction Program, Recovery Audit Contractors, Cancer Prevention and Treatment Demonstration for Ethnic and Racial Minorities, Rural Hospice Demonstration, Medicare Replacement Drug Demonstration, Frequent Hemodialysis Network Clinical Trials, Demonstration Project for Medical Adult Day Care Services, MMA 623 ESRD Bundled Payment Demonstration, Care Management for High-Cost Beneficiaries Demonstration, DoD Subvention Demonstration, MMA Section 651 Expansion of Coverage of Chiropractic Services Demonstration, Medicare Home Health Independence Demonstration, Demonstration Project For Competitive Bidding of Clinical Laboratory Services, Community Nursing Organization Demonstration, Demonstration Project for Consumer-Directed Chronic Outpatient Services, End Stage Renal Disease (ESRD) Disease Management Demonstration, Medicare Preferred Provider Organization Demonstration, Medicare BIPA Disease Management Demonstration, Premier Hospital Quality Incentive Demonstration, End-Stage Renal Disease Managed Care Demonstration, Social Health Maintenance Organization Demonstration (SHMO), Medicare Stop Smoking Program, Medicare Partnerships for Quality Services Demonstration, Demonstrations Serving Those Dually-Eligible for Medicare and Medicare, Evercare Demonstration, Home Health Agency Prospective Payment Demonstration, Durable Medical Equipment Competitive Bidding Demonstration, Informatics for Diabetes Education and Telemedicine (IDEATel) Demonstration Project, Medicare Physician Group Practice Demonstration, Medicare Lifestyle Modification Program Demonstration, Medicare Participating Heart Bypass Center Demonstration, Medicare Choices Demonstration, Medicare Case Management (Early Coordinated Care) Demonstrations	//innovation.cms.gov/Medicare-Demonstrations/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
63	Medicare Advantage Value-Based Insurance Design Model	Accepting Applications, Ongoing	34	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	This model is testing the value of extra benefits or reductions in cost sharing for Medicare Advantage enrollees with chronic health conditions.	\N	\N	\N	\N	CT,FL,IN,MA,MI,MN,NY,OR,PA,RI,VA	Medicare Advantage Value-Based Insurance Design Model, Health Plan Innovation Initiatives, Medicare Advantage, value-based insurance design, HPI, Medicare, vbid, VBID, MA-VBID, chronic conditions, hospice	/initiatives/vbid/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
64	Home Health Value-Based Purchasing Model	No Longer Active	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	This model was designed to support greater quality and efficiency among Medicare-certified home health agencies by shifting away from payments based on volume towards payments based on quality.	\N	\N	\N	\N	AZ,FL,IA,MA,MD,NE,NC,TN,WA	Home Health Value-Based Purchasing Model, Medicare, value based, HHVBP	/initiatives/home-health-value-based-purchasing-model	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
65	Part D Enhanced Medication Therapy Management Model	No Longer Active	6	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	This model tested changes to the Part D program to achieve better alignment of PDP sponsor and government financial interests, while also creating incentives for robust investment and innovation in MTM programs, lower health costs, and higher quality care.	\N	\N	\N	\N	AZ,FL,IA,LA,MN,MT,NE,ND,SD,VA,WY	Part D Enhanced Medication Therapy Management Model, Health Plan Innovation Initiatives, Medicare, Part D, MTM, Enhanced MTM, PDP, Health Plan Innovation Initiatives, HPI, drug coverage	/initiatives/enhancedmtm/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
66	Accountable Health Communities Model	No Longer Active	28	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The Accountable Health Communities Model tested whether addressing unmet health-related social needs could reduce health care costs and utilization among community Medicare and Medicaid beneficiaries.	\N	\N	\N	\N	AZ,CO,CT,GA,IL,IN,KY,MD,MI,MN,NJ,NM,NY,OH,OK,OR,PA,TN,TX,VA,WV	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Accountable Health Communities Model, Medicare, Medicaid, community services, social needs, health related social needs, bridge organizations, clinical-community collaboration, community services	/initiatives/ahcm/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
70	Regional Budget Payment Concept	Ongoing	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The Centers for Medicare and Medicaid Services is seeking input on the feasibility of regional multi-payer prospective budgets as a potential payment model and potential for rural areas.	\N	\N	\N	\N	\N	Regional Budget Payment Concept, geographically defined communities, global budgets, regionally-based payment approaches	/initiatives/regional-budget-payment/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
83	Pennsylvania Rural Health Model	Ongoing	18	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	This model aims to increase access to high-quality care in Pennsylvania rural settings while reducing hospital expenditures across payers.	\N	\N	\N	\N	PA	Pennsylvania Rural Health Model, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, rural health, PA, Pennsylvania, all-payer	/initiatives/pa-rural-health-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
84	State Innovation Models Initiative: Round One	Ongoing	25	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The first round of the State Innovation Models Initiative awarded nearly $300 million to 25 states to design or test innovative health care payment and service delivery models.	\N	\N	\N	\N	AR,CA,CO,CT,DE,IA,ID,IL,MA,ME,MD,MI,MN,NH,NY,OH,OR,PA,RI,TN,TX,UT,VT,WA	State Innovation Models Initiative: Round One , SIM, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	/initiatives/State-Innovations-Round-One/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
86	Physician-Focused Payment Models (PFPMs): Secretary's Response to Proposals	Not Applicable	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Medicare Access and CHIP Reauthorization Act of 2015 (MACRA)	The Medicare Access and CHIP Reauthorization Act of 2015 (MACRA) established the Physician-Focused Payment Model Technical Advisory Committee (PTAC) to review and assess physician-focused payment models (PFPMs) based on stakeholder proposals submitted to the committee.	\N	\N	\N	\N	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Physician-Focused Payment Models (PFPMs): Secretary's Response to Proposals, Physician-Focused Payment Model Technical Advisory Committee (PTAC), PTAC	/initiatives/pfpms/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
89	Direct Provider Contracting Models - Request for Information	Under Development	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	The Centers for Medicare & Medicaid Services (CMS) is seeking broad input on direct provider contracting (DPC) between payers and primary care or multi-specialty groups.	\N	\N	\N	\N	\N	Direct Provider Contracting Models - Request for Information, DPC, Medicare, Medicaid, Children's Health Insurance Program (CHIP), fee-for-service (FFS)	/initiatives/direct-provider-contracting/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
92	Maryland Total Cost of Care Model	Ongoing	550	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 1115A of the Social Security Act	This model is the first CMS Innovation Center model to hold a state fully at risk for the total cost of care for Medicare beneficiaries.	\N	\N	\N	\N	MD	Maryland Total Cost of Care Model, TCOC, Maryland, Medicare, Outcomes-Based Credits, Substance-Use Disorder (SUD), Diabetes, Hypertension, Obesity, Smoking, Asthma	https://innovation.cms.gov/initiatives/md-tccm/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
94	International Pricing Index (IPI) Model	Withdrawn	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 1115A of the Social Security Act	This proposed model would aim to preserve or enhance quality of care for beneficiaries while reducing Medicare Part B drug expenditures.	\N	\N	\N	\N	\N	International Pricing Index (IPI) Model, IPI Model, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Medicare, Part B, Competitive Acquisition Program (CAP)	/initiatives/ipi-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
95	Artificial Intelligence (AI) Health Outcomes Challenge	No Longer Active	7	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	America COMPETES Reauthorization Act	Competition to innovate how artificial intelligence (AI) can be implemented in current and new health care payment and service delivery models.	\N	\N	\N	\N	\N	Artificial Intelligence (AI) Health Outcomes Challenge, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, technology, competition, Medicare, Medicaid, big data	/initiatives/artificial-intelligence-health-outcomes-challenge/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
96	Part D Payment Modernization Model	No Longer Active	2	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	This voluntary model aimed to test better alignment of prescription drug plan design improvements and incentives to improve quality and lower costs.	\N	\N	\N	\N	\N	Part D Payment Modernization Model, prescription drugs, Part D	/initiatives/part-d-payment-modernization-model/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
97	Emergency Triage, Treat, and Transport (ET3) Model	Participants Announced	184	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 1115A of the Social Security Act	Voluntary payment model that will provide greater ambulance care team flexibility to address Medicare beneficiary emergency care needs following a 911 call.	\N	\N	\N	\N	AL,AZ,CA,CO,CT,FL,GA,HI,IL,KS,KY,LA,MA,MD,ME,MI,MO,MO,NC,NH,NJ,NM,NV,NY,OH,OK,OR,PA,SC,SD,TN,TX,VA,WV,WI	Emergency Triage, Treat, and Transport (ET3) Model, ET3, ambulance, 911, Medicare, emergency, triage, care in place	/initiatives/et3/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
102	Part D Senior Savings Model	Accepting Applications, Ongoing	106	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	This voluntary model tests the impact of offering beneficiaries an increased choice of enhanced alternative Part D plan options that offer lower out-of-pocket costs for insulin.	\N	\N	\N	\N	AK,AL,AS,AR,AZ,CA,CO,CT,DC,DE,FL,FM,GA,GU,HI,IA,ID,IL,IN,KS,KY,LA,MA,MD,ME,MH,MI,MN,MO,MP,MS,MT,NE,NM,NC,ND,NH,NJ,NV,NY,OH,OK,OR,PA,PR,PW,RI,SC,SD,TN,TX,UM,UT,VA,VI,VT,WA,WI,WV,WY	Part D Senior Savings Model, Part D, Senior Savings Model, prescription drugs, Medicare, Medicare Advantage (MA), insulin, seniors	/initiatives/part-d-savings-model	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
103	Value in Opioid Use Disorder Treatment Demonstration Program	Participants Announced	53	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 6042 of the Substance Use-Disorder Prevention that Promotes Opioid Recovery and Treatment for Patients and Communities Act (SUPPORT Act)	This demonstration aims to increase access to opioid use disorder treatment services, improve physicial and mental health outcomes and reduce Medicare expenditures.	\N	\N	\N	\N	\N	Value in Opioid Use Disorder Treatment Demonstration Program, Opioids, Opioid Use Disorder (OUD), Value in Treatment (ViT), Substance Use-Disorder Prevention that Promotes Opioid Recovery and Treatment for Patients and Communities Act (SUPPORT Act)	/innovation-models/value-in-treatment-demonstration/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
104	CHART Model	Announced	4	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	This model aims to empower rural communities to develop a high quality care delivery system through new seed funding, payment structures, operational and regulatory flexibilities and technical and learning support.	\N	\N	\N	\N	\N	Community Health Access and Rural Transformation (CHART) Model, rural health, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Medicare, hospitals, Critical Access Hospitals (CAHs)	/initiatives/chart-model	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
105	Most Favored Nation Model	Withdrawn	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 1115A of the Social Security Act	Mandatory, nationwide model that tests whether more closely aligning Medicare Part B drugs payments with international prices and removing incentives to use higher-cost drugs can control unsustainable Medicare Part B spending without adversely affecting quality of care for beneficiaries.	\N	\N	\N	\N	\N	Most Favored Nation Model, MFN Model, prescription drugs, Medicare Part B, Organisation for Economic Co-operation and Development (OCED), Medicare	/innovation-models/most-favored-nation-model	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
106	Geographic Direct Contracting Model	Withdrawn	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 1115A of the Social Security Act	A payment and care delivery model that proposed testing whether a geographic-based approach to care delivery and value-based care could improve health and reduce costs for Medicare beneficiaries across an entire geographic region.	\N	\N	\N	\N	\N	Geographic Direct Contracting Model, Direct Contracting Model Options, DC, primary care, voluntary, value, quality, flexibility	/innovation-models/geographic-direct-contracting-model	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
107	Strategic Direction	Not Applicable	N/A	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	N/A	In fall 2021, the CMS Innovation Center set a strategic goal for its next ten years: to transform the health system into one that achieves equitable outcomes through high quality, affordable, person-centered care.	\N	\N	\N	\N	\N	CMMI Strategic Direction, Accountable Care, Health Equity, Care Innovation, Improved Access to Care, Affordability, Partnerships, healthcare transformation, Strategic Summary, ten year goals, person-centered care	https://innovation.cms.gov/strategic-direction	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
108	Expanded Home Health Value-Based Purchasing Model	Ongoing	\N	Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models	Section 3021 of the Affordable Care Act	Building upon experience from the original Home Health Value-Based Purchasing Model (HHVBP Model), this model expands presence to all fifty states, District of Columbia, and the U.S. territories.	\N	\N	\N	\N	\N	Expanded Home Health Value-Based Purchasing Model, Expanded HHVBP Model, HHVBP, Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models, Medicare, home health	/innovation-models/expanded-home-health-value-based-purchasing-model	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
6	Community-based Care Transitions Program	No Longer Active	18	Initiatives to Speed the Adoption of Best Practices	Section 3026 of the Affordable Care Act	The Community-Based Care Transition Program supported community-based organizations to reduce readmissions by improving transitions of high-risk Medicare beneficiaries from the inpatient hospital setting to home or other care settings.	\N	\N	\N	\N	CA,IL,NY,AZ,PA,MA,MI,OH,NC,AL,IN,KY	Speeding the Adoption of Best Practices, Partnership for Patients, Nationwide, Hospital-Acquired Conditions, Readmissions, CCTP, Community-Based Care Transitions Program, Medicare, Hospital Engagement Networks	/initiatives/CCTP/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
16	Innovation Advisors Program	No Longer Active	71	Initiatives to Speed the Adoption of Best Practices	Section 3021 of the Affordable Care Act	The Innovation Advisors Program supported dedicated, skilled individuals in the health care system who can test new models of care delivery in their own organizations and work locally to improve the health of their communities.	\N	\N	\N	\N	MA,CA,NC,MD,WI,TN,DC,PA,RI,MN,MI,IL,NY,CO,KY,WA,VA,OH,LA,NH,UT,OR,WY,GA,CA,IA,NJ,HI,TX	Initiatives to Speed the Adoption of Best Practices, Innovation Advisors Program	/initiatives/Innovation-Advisors-Program/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
23	Medicare Imaging Demonstration	No Longer Active	5	Initiatives to Speed the Adoption of Best Practices	Section 135(b) of the Medicare Improvements for Patients and Providers Act of 2008	Collected data regarding physician use of advanced diagnostic imaging services to determine the appropriateness of services in relation to medical specialty guidelines.	\N	\N	\N	\N	\N	Initiatives to Speed the Adoption of Best Practices, Medicare Imaging Demonstration, MRI, computed tomography, CT scan, nuclear medicine	/initiatives/Medicare-Imaging/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
26	Partnership for Patients	No Longer Active	\N	Initiatives to Speed the Adoption of Best Practices	Section 3021 of the Affordable Care Act	The Partnership for Patients was a nationwide public-private partnership that offered support to physicians, nurses and other clinicians working in and out of hospitals to reduce hospital-acquired conditions and readmissions.	\N	\N	\N	\N	\N	Initiatives to Speed the Adoption of Best Practices, Partnership for Patients, Community-based Care Transitions Program, Hospital Engagement Networks (HENs), Hospital-Acquired Conditions, Care Transitions, Medicare, Readmissions	/initiatives/Partnership-for-Patients/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
61	Million Hearts: Cardiovascular Disease Risk Reduction Model	No Longer Active	319	Initiatives to Speed the Adoption of Best Practices	Section 3021 of the Affordable Care Act	This model provided opportunity for the design of sustainable care approaches to decrease cardiovascular disease risk for Medicare beneficiaries.	\N	\N	\N	\N	AZ,AK,CA,CO,DC,WA,OR,ID,MT,UT,WY,NM,TX,OK,KS,ND,NE,MN,IA,MO,AR,LA,MS,TN,IL,WI,MI,IN,OH,AL,GA,FL,SC,NC,VA,PA,OH,NY,NJ,CT,RI,NH,ME,DE,HI,PR	Million Hearts: Cardiovascular Disease Risk Reduction Model, Million Hearts, CVD, Initiative to Speed the Adoption of Best Practices, Medicare, heart attacks, stroke, predictive modelling, population-level risk management	/initiatives/Million-Hearts-CVDRRM/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
71	Historically Black Colleges and Universities (HBCU) Research Grant Program	Ongoing	\N	Initiatives to Speed the Adoption of Best Practices	Section 1110 of the Social Security Act	This program supports researchers at Historically Black Colleges and Universities (HBCUs) in carying out health services research for diverse CMS beneficiary populations.	\N	\N	\N	\N	\N	Historically Black Colleges and Universities (HBCU) Research Grant Program, diversity, grant, health research	/initiatives/hbcu/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
72	Hispanic Health Services Research Grant Program	Ongoing	\N	Initiatives to Speed the Adoption of Best Practices	Section 1110 of the Social Security Act	This program supports research to implement Hispanic American health services to meet the needs of diverse CMS beneficiary populations.	\N	\N	\N	\N	\N	Hispanic Health Services Research Grant Program, diversity, grant, health research	/initiatives/hhsrgp/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
73	Medicare Diabetes Prevention Program (MDPP) Expanded Model	Participants Announced, Ongoing	947	Initiatives to Speed the Adoption of Best Practices	Section 1115A of the Social Security Act	This program is a structured lifestyle intervention to prevent onset of diabetes in pre-diabetic individuals.	\N	\N	\N	\N	AR,AZ,CA,CO,DE,FL,GA,IA,ID,IL,IN,KS,KY,MA,MD,ME,MI,MN,MT,NC,NH,ND,NY,OH,OK,OR,PA,SC,TN,TX,UT,WA,WI,WV	Medicare Diabetes Prevention Program (MDPP) Expanded Model, Medicare, diabetes, proposed rule	/initiatives/medicare-diabetes-prevention-program/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
8	Comprehensive Primary Care Initiative	No Longer Active	442	Primary Care Transformation	Section 3021 of the Affordable Care Act	The CPC Initiative was a multi-payer initiative that provided financial support to primary care practices in 7 markets.	\N	\N	\N	\N	NY,NJ,CO,OK,AR,OH,OR,KY	Primary Care Transformation, Comprehensive Primary Care Initiative, Medicare, managed care, multi-payer	/initiatives/Comprehensive-Primary-Care-Initiative/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
10	FQHC Advanced Primary Care Practice Demonstration	No Longer Active	434	Primary Care Transformation	Section 3021 of the Affordable Care Act	The Federally Qualified Health Center (FQHC) Advanced Primary Care Practice Demonstration tested the efficiency of patient-centered medical homes among FQHCs.	\N	\N	\N	\N	WA,WI,CA,GA,LA,IL,WV,KY,ID,NH,AK,NC,AR,MI,HI,MD,TX,SC,IA,MI,NM,MO,PA,MS,OH,NJ,NY,IN,MS,TN,SD,OR,VA,CO,NE,MT,FL,MA,CT,WY,MN,KY,RI,ND,ID,ME,AL,KS,OK,AL,OR	Primary Care Transformation, Federally Qualified Health Center (FQHC), medical home, Medicare, managed care, Medicaid, dual eligibles, Medicare, FQHC Advanced Primary Care Practice Demonstration	/initiatives/FQHCs/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
11	Frontier Extended Stay Clinic Demonstration	No Longer Active	5	Primary Care Transformation	Section 434 of the Medicare Prescription Drug, Improvement, and Modernization Act of 2003	The Frontier Extended Stay Clinic Demonstration allowed remote clinics to treat patients for more extended periods, including overnight stays, that are entailed in routine physician visits.	\N	\N	\N	\N	AK,WA	Primary Care Transformation, Frontier Extended Stay Clinic Demonstration, acute care, remote geographic areas	/initiatives/Frontier-Extended-Stay-Clinic/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
12	Graduate Nurse Education Demonstration	No Longer Active	5	Primary Care Transformation	Section 5509 of the Affordable Care Act	The Graduate Nurse Education Demonstration supported hospitals for the reasonable cost of providing clinical training to advanced practice registered nursing (APRN) training.	\N	\N	\N	\N	PA,NC,AZ,IL,TX	Primary Care Transformation, Graduate Nurse Education Demonstration, GNE, Advanced Practice Registered Nurses (APRNs), Medicare	/initiatives/GNE/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
14	Independence at Home Demonstration	Ongoing	9 Participating Sites	Primary Care Transformation	Section 3024 of the Affordable Care Act as amended by the Bipartisan Budget Act of 2018	The Independence at Home Demonstration is supporting home-based primary care for Medicare beneficiaries with multiple chronic conditions.	\N	\N	\N	\N	MA,DE,OH,NY,NC,OR,PA,TX,FL,MI,VA,WI	Primary Care Transformation, Independence at Home Demonstration, Medicare, home-based care, chronic conditions	/initiatives/Independence-at-Home/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
20	Medicare Coordinated Care Demonstration	No Longer Active	15	Primary Care Transformation	Section 4106 of the Balanced Budget Act of 1997	The Medicare Coordinated Care Demonstration tested whether providing coordinated care services to Medicare beneficiaries with complex chronic conditions could yield patient outcomes without increasing program costs.	\N	\N	\N	\N	\N	Primary Care Transformation, Medicare Coordinated Care Demonstration, Medicare	/initiatives/Medicare-Coordinated-Care/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
24	Multi-Payer Advanced Primary Care Practice	No Longer Active	5	Primary Care Transformation	Section 402 of the Social Security Amendments of 1967 as amended	In the Multi-Payer Advanced Primary Care Practice Demonstration, CMS joined in multi-payer primary care initiatives that were being conducted within states.	\N	\N	\N	\N	ME,VT,RI,NY,MI	Primary Care Transformation, Multi-payer Advanced Primary Care Practice Demonstration, medical home, APC, Medicaid, Medicare	/initiatives/Multi-Payer-Advanced-Primary-Care-Practice/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
46	Transforming Clinical Practice Initiative	No Longer Active	41	Primary Care Transformation	Section 3021 of the Affordable Care Act	A large-scale health transformation initiative that supported clinician practices in sharing, adapting and developing comprehensive quality improvement strategies.	\N	\N	\N	\N	AK,AL,AR,AZ,CA,CO,CT,DE,FL,GA,HI,IA,ID,IL,IN,KS,KY,LA,MA,ME,MD,MI,MN,MO,MS,MT,NC,ND,NE,NH,NJ,NM,NV,NY,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VA,VT,WA,WI,WV,WY	Primary Care Transformation, Transforming Clinical Practice Initiative, TCPI, quality improvement strategies, clinicians, learning networks, population-based care, large-scale investment, value-based payment, infrastructure	/initiatives/Transforming-Clinical-Practices/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
69	Comprehensive Primary Care Plus	No Longer Active	2610	Primary Care Transformation	Section 3021 of the Affordable Care Act	A national advanced primary care medical home model that aimed to strengthen primary care through regionally-based multi-payer payment reform and care delivery transformation.	\N	\N	\N	\N	AR,CO,HI,KS,KY,MO,MI,MT,NJ,NY,OH,OK,OR,PA,RI,TN	Comprehensive Primary Care Plus, CPC+, primary care, medical home	/initiatives/comprehensive-primary-care-plus/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
98	Primary Care First Model Options	Announced, Ongoing	over 3000	Primary Care Transformation	Section 1115A of the Social Security Act	Voluntary payment model options that reward value and quality through innovative payment structures and emphasizing the doctor-patient relationship supporting advanced primary care.	\N	\N	\N	\N	AK,AR,CA,CO,DE,FL,HI,KS,KY,LA,MA,ME,MI,MO,MT,ND,NE,NH,NJ,NY,OH,OK,OR,PA,RI,TN,VA	Primary Care First Model Options, PCF,primary care, voluntary, value, quality, flexibility	/initiatives/primary-care-first/	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
992	Global and Professional Direct Contracting (GPDC) Model	Ongoing	99	Primary Care Transformation	Section 1115A of the Social Security Act	Voluntary payment model options that innovate Medicare fee-for-service approaches to produce value and high-quality care outcomes.	\N	\N	\N	\N	\N	Global and Professional Direct Contracting (GPDC) Model, GPDC Model, Direct Contracting Model Options, DC, primary care, voluntary, value, quality, flexibility	/innovation-models/direct-contracting-model-options	t	MINT	2022-06-07 22:02:13.038154+00	\N	\N
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	Add CRUD Role And App User	SQL	V1__Add_CRUD_Role_And_App_User.sql	-1598380595	postgres	2022-06-03 17:35:44.998639	26	t
2	2	Add EUA Domain	SQL	V2__Add_EUA_Domain.sql	-530865179	postgres	2022-06-03 17:35:45.092446	6	t
3	3	Add DataTypes	SQL	V3__Add_DataTypes.sql	-323973597	postgres	2022-06-03 17:35:45.155432	16	t
4	4	Add Model Plan	SQL	V4__Add_Model_Plan.sql	-1563312200	postgres	2022-06-03 17:35:45.226388	10	t
5	5	Add Plan Collaborator	SQL	V5__Add_Plan_Collaborator.sql	1292567469	postgres	2022-06-03 17:35:45.27382	16	t
6	6	Add Plan Basics	SQL	V6__Add_Plan_Basics.sql	1343517938	postgres	2022-06-03 17:35:45.332631	13	t
7	7	Add Plan Milestones	SQL	V7__Add_Plan_Milestones.sql	-2090419323	postgres	2022-06-03 17:35:45.387537	13	t
8	8	Add Plan Document	SQL	V8__Add_Plan_Document.sql	-1218104147	postgres	2022-06-03 17:35:45.448414	11	t
9	9	Plan Collaborator Lead Trigger	SQL	V9__Plan_Collaborator_Lead_Trigger.sql	-1060686448	postgres	2022-06-03 17:35:45.498036	11	t
10	10	Add Plan Discussion	SQL	V10__Add_Plan_Discussion.sql	-113247073	postgres	2022-06-03 17:35:45.541174	23	t
11	11	Add Plan General Characteristics	SQL	V11__Add_Plan_General_Characteristics.sql	1627160967	postgres	2022-06-03 17:35:45.636543	57	t
12	12	Add Plan Beneficiaries	SQL	V12__Add_Plan_Beneficiaries.sql	760399613	postgres	2022-06-03 17:35:45.727475	13	t
13	13	Add Plan Participants And Providers	SQL	V13__Add_Plan_Participants_And_Providers.sql	1998052900	postgres	2022-06-03 17:35:45.781583	19	t
\.


--
-- Data for Name: model_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.model_plan (id, model_name, model_category, cms_centers, cms_other, cmmi_groups, archived, status, created_by, created_dts, modified_by, modified_dts) FROM stdin;
53054496-6d1f-47f5-b6a0-1edaf73b935e	Empty Plan	\N	\N	\N	\N	f	PLAN_DRAFT	MINT	2022-06-03 17:41:40.83519+00	\N	\N
95399697-8c37-4225-b09d-7ca4fd0ad2b0	Plan With Collaborators	\N	\N	\N	\N	f	PLAN_DRAFT	MINT	2022-06-03 17:41:40.870533+00	\N	\N
ce3405a0-3399-4e3a-88d7-3cfc613d2905	Complete Plan	ACCOUNTABLE_CARE	{CENTER_FOR_MEDICARE}	\N	\N	f	PLAN_DRAFT	MINT	2022-06-03 17:41:40.907249+00	MINT	2022-06-03 17:41:40.941225+00
9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	Plan With Discussions	\N	\N	\N	\N	f	PLAN_DRAFT	MINT	2022-06-03 17:41:41.006393+00	\N	\N
6e224030-09d5-46f7-ad04-4bb851b36eab	PM Butler's great plan	PRIMARY_CARE_TRANSFORMATION	{CENTER_FOR_MEDICARE,OTHER}	The Center for Awesomeness	{STATE_INNOVATIONS_GROUP,POLICY_AND_PROGRAMS_GROUP}	f	PLAN_COMPLETE	MINT	2022-06-03 19:32:24.356021+00	MINT	2022-06-03 20:56:30.06897+00
12897703-dac0-4e65-be7f-4907232eb176	Plan With Documents	\N	\N	\N	\N	f	PLAN_DRAFT	MINT	2022-06-06 13:10:45.719925+00	\N	\N
\.


--
-- Data for Name: plan_basics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_basics (id, model_plan_id, model_type, problem, goal, test_inventions, note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
1c12315a-5647-49cb-9371-8a0a2fa409a4	53054496-6d1f-47f5-b6a0-1edaf73b935e	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.847303+00	\N	\N	READY
f31f832d-b744-40b5-b881-dd264a3cd9f6	95399697-8c37-4225-b09d-7ca4fd0ad2b0	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.880114+00	\N	\N	READY
6680c61b-81cf-425c-adb1-d9e2ea356d9a	ce3405a0-3399-4e3a-88d7-3cfc613d2905	VOLUNTARY	The problem	The goal	The interventions	\N	MINT	2022-06-03 17:41:40.914497+00	MINT	2022-06-03 17:41:40.956661+00	COMPLETE
92a17c2e-4629-4b34-a0b0-2df0694d9113	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:41.012522+00	\N	\N	READY
4132e334-4a10-4e8e-9ef1-a72fe910dc82	6e224030-09d5-46f7-ad04-4bb851b36eab	MANDATORY	There is not enough candy	To get more candy	The great candy machine	The machine doesn't work yet	MINT	2022-06-03 19:32:24.411254+00	MINT	2022-06-03 20:54:20.096083+00	COMPLETE
7cda2186-0141-4c7e-bcf4-9b041ea0b9a5	12897703-dac0-4e65-be7f-4907232eb176	\N	\N	\N	\N	\N	MINT	2022-06-06 13:10:45.72351+00	\N	\N	READY
\.


--
-- Data for Name: plan_beneficiaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_beneficiaries (id, model_plan_id, beneficiaries, beneficiaries_other, beneficiaries_note, treat_dual_elligible_different, treat_dual_elligible_different_how, treat_dual_elligible_different_note, exclude_certain_characteristics, exclude_certain_characteristics_criteria, exclude_certain_characteristics_note, number_people_impacted, estimate_confidence, confidence_note, beneficiary_selection_method, beneficiary_selection_other, beneficiary_selection_note, beneficiary_selection_frequency, beneficiary_selection_frequency_other, beneficiary_selection_frequency_note, beneficiary_overlap, beneficiary_overlap_note, precedence_rules, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
d3795217-240c-4d53-8219-7e618eecb19b	53054496-6d1f-47f5-b6a0-1edaf73b935e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.864778+00	\N	\N	READY
03733612-10f7-4d8f-ac3c-4d331bec2e1a	95399697-8c37-4225-b09d-7ca4fd0ad2b0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.898432+00	\N	\N	READY
c74858a1-1148-4bfc-a3fb-24f4e48f166f	ce3405a0-3399-4e3a-88d7-3cfc613d2905	\N	\N	\N	YES	\N	\N	TBD	\N	\N	500	NOT_AT_ALL	\N	\N	\N	\N	QUARTERLY	\N	\N	YES_NEED_POLICIES	\N	\N	MINT	2022-06-03 17:41:40.931363+00	MINT	2022-06-03 17:41:41.001616+00	COMPLETE
691e52f7-1964-47ff-b8d4-00f7c2c159c7	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:41.027163+00	\N	\N	READY
b7aa2c9f-9e38-4e95-92d9-60bd791e8c59	6e224030-09d5-46f7-ad04-4bb851b36eab	{MEDICARE_FFS,DISEASE_SPECIFIC,OTHER}	The Gumdrop Kids	The disease is kidney failure	YES	Priority given to kidney failure	Can be overridden by vice-presidential order	YES	Exclude any individuals who qualify for 5 other models	Exceptions can be made by presidential order	25	SLIGHTLY	This is probably correct	{PROVIDER_SIGN_UP,OTHER}	Competitive wrestling, elimination style	Priority given to provider sign up	ANNUALLY	On February 29th when it occurs	Also as needed	YES_NEED_POLICIES	This will likely overlap	This takes precendence over all other models	MINT	2022-06-03 19:32:24.432349+00	\N	\N	READY
5b50b7f3-a407-4e78-a3be-8ab6e55f8dbd	12897703-dac0-4e65-be7f-4907232eb176	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-06 13:10:45.729635+00	\N	\N	READY
\.


--
-- Data for Name: plan_collaborator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_collaborator (id, model_plan_id, eua_user_id, full_name, team_role, created_by, created_dts, modified_by, modified_dts) FROM stdin;
b49e65fd-4767-4aed-b40e-3e1e5c20be57	53054496-6d1f-47f5-b6a0-1edaf73b935e	MINT	mint Doe	MODEL_LEAD	MINT	2022-06-03 17:41:40.840176+00	\N	\N
736b1d46-b2ac-4d76-89b2-4a231556b1c5	95399697-8c37-4225-b09d-7ca4fd0ad2b0	MINT	mint Doe	MODEL_LEAD	MINT	2022-06-03 17:41:40.874974+00	\N	\N
62f0908e-d50f-4b2f-a975-0742f46517a3	95399697-8c37-4225-b09d-7ca4fd0ad2b0	BTAL	Betty Alpha	LEADERSHIP	MINT	2022-06-03 17:41:40.903246+00	\N	\N
2f18ee4e-51d0-4e19-91fb-1660296ba9ad	ce3405a0-3399-4e3a-88d7-3cfc613d2905	MINT	mint Doe	MODEL_LEAD	MINT	2022-06-03 17:41:40.911047+00	\N	\N
e5540130-9d15-4cbd-82ec-d8d924dfc513	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	MINT	mint Doe	MODEL_LEAD	MINT	2022-06-03 17:41:41.008759+00	\N	\N
38a59d7a-fc37-4bda-acec-ffd44bf8b4d2	6e224030-09d5-46f7-ad04-4bb851b36eab	PBLR	PM Butler	MODEL_LEAD	MINT	2022-06-03 20:58:45.560727+00	MINT	2022-06-03 20:59:28.411263+00
f1b90915-c863-405a-b4ad-4558e01791f0	6e224030-09d5-46f7-ad04-4bb851b36eab	MINT	mint Doe	LEADERSHIP	MINT	2022-06-03 19:32:24.408045+00	MINT	2022-06-03 20:59:34.235474+00
2cd9fc52-294c-49cb-b78a-3e4a551b07c9	12897703-dac0-4e65-be7f-4907232eb176	MINT	mint Doe	MODEL_LEAD	MINT	2022-06-06 13:10:45.722141+00	\N	\N
\.


--
-- Data for Name: plan_discussion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_discussion (id, model_plan_id, content, status, created_by, created_dts, modified_by, modified_dts) FROM stdin;
b092aaa9-a3a7-4802-ac10-0a5d58fb5d70	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	Why will nobody answer this!?	UNANSWERED	MINT	2022-06-03 17:41:41.030799+00	\N	\N
e847939b-dda7-48b8-88bc-99442017b0c2	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	Can someone please answer this?	ANSWERED	MINT	2022-06-03 17:41:41.033957+00	MINT	2022-06-03 17:41:41.048593+00
550dfb5f-b730-4e7f-a991-aca280f0298b	6e224030-09d5-46f7-ad04-4bb851b36eab	What is the purpose of this plan?	ANSWERED	JAKE	2022-06-03 19:32:24.416474+00	\N	\N
\.


--
-- Data for Name: plan_document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_document (id, model_plan_id, file_type, bucket, file_key, virus_scanned, virus_clean, file_name, file_size, document_type, other_type, optional_notes, deleted_at, created_by, created_dts, modified_by, modified_dts) FROM stdin;
13044089-956b-476e-8b86-a1a521ffde59	12897703-dac0-4e65-be7f-4907232eb176	application/pdf	mint-app-file-uploads	b23d964c-3e44-426b-8dcb-aa979adc07a2.pdf	f	f	sample.pdf	3028	CONCEPT_PAPER		Virus scan should be clean	\N	MINT	2022-06-06 13:11:01.286371+00	\N	\N
e2416f82-2847-4e12-a9c0-5ccea325ea92	12897703-dac0-4e65-be7f-4907232eb176	application/pdf	mint-app-file-uploads	3225ae75-8ca7-4b78-aa7e-ea2334226c07.pdf	f	f	sample.pdf	3028	MARKET_RESEARCH		Virus scan should be pending	\N	MINT	2022-06-06 13:11:13.342637+00	\N	\N
39536488-354e-4cd8-a8c6-1647f2a56c4e	12897703-dac0-4e65-be7f-4907232eb176	application/pdf	mint-app-file-uploads	25c81e5a-4940-45fe-85c7-fcbe37a3c317.pdf	f	f	sample.pdf	3028	OTHER	Sample Document	Virus scan should be infected	\N	MINT	2022-06-06 13:11:24.674723+00	\N	\N
\.


--
-- Data for Name: plan_general_characteristics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_general_characteristics (id, model_plan_id, is_new_model, existing_model, resembles_existing_model, resembles_existing_model_which, resembles_existing_model_how, resembles_existing_model_note, has_components_or_tracks, has_components_or_tracks_differ, has_components_or_tracks_note, alternative_payment_model, alternative_payment_model_types, alternative_payment_model_note, key_characteristics, key_characteristics_other, key_characteristics_note, collect_plan_bids, collect_plan_bids_note, manage_part_c_d_enrollment, manage_part_c_d_enrollment_note, plan_contact_updated, plan_contact_updated_note, care_coordination_involved, care_coordination_involved_description, care_coordination_involved_note, additional_services_involved, additional_services_involved_description, additional_services_involved_note, community_partners_involved, community_partners_involved_description, community_partners_involved_note, geographies_targeted, geographies_targeted_types, geographies_targeted_types_other, geographies_targeted_applied_to, geographies_targeted_applied_to_other, geographies_targeted_note, participation_options, participation_options_note, agreement_types, agreement_types_other, multiple_patricipation_agreements_needed, multiple_patricipation_agreements_needed_note, rulemaking_required, rulemaking_required_description, rulemaking_required_note, authority_allowances, authority_allowances_other, authority_allowances_note, waivers_required, waivers_required_types, waivers_required_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
27d00d3e-7829-480a-bef7-833b1d74dabd	53054496-6d1f-47f5-b6a0-1edaf73b935e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.859484+00	\N	\N	READY
33d7c52b-1343-4a68-abe8-5fad733990ae	95399697-8c37-4225-b09d-7ca4fd0ad2b0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.893298+00	\N	\N	READY
7d390eb8-f647-4f6c-ab72-4bb7aff60f00	ce3405a0-3399-4e3a-88d7-3cfc613d2905	t	\N	f	\N	\N	\N	f	\N	\N	t	{REGULAR,MIPS}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	t	Lots of additional services	\N	f	\N	\N	f	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	t	Lots of rules	\N	\N	\N	\N	f	\N	\N	MINT	2022-06-03 17:41:40.924851+00	MINT	2022-06-03 17:41:40.985636+00	COMPLETE
51e25d65-7d22-4f0e-98b5-2a1df252ab83	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:41.022457+00	\N	\N	READY
68fad47f-31c7-479f-bc14-2740523083c1	12897703-dac0-4e65-be7f-4907232eb176	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-06 13:10:45.727928+00	\N	\N	READY
41a11243-c0c8-4b6c-8a10-e8b0cbaa03b2	6e224030-09d5-46f7-ad04-4bb851b36eab	t	My Existing Model	t	{"Exist Model 1","Exist Model 2"}	They both have a similar approach to payment	Check the payment section of the existing models	t	One track does something one way, the other does it another way	Look at the tracks carefully	t	{MIPS,ADVANCED}	Has 2 APM types!	{PART_C,PART_D,OTHER}	It's got lots of class and character	other characteristics might still be discovered	t	It collects SOOO many plan bids you wouldn't even get it broh	f	It definitely will not manage Part C/D enrollment, are you crazy??	f	I forgot to update it, but will soon	t	It just is!	Just think about it	f	\N	\N	t	Very involved in the community	Check the community partners section	t	{STATE,OTHER}	The WORLD!	{PARTICIPANTS,OTHER}	All Humans	\N	t	Really anyone can participate	{OTHER}	A firm handshake	f	A firm handshake should be more than enough	t	The golden rule - target date of 05/08/2023	\N	{CONGRESSIONALLY_MANDATED}	\N	\N	t	{FRAUD_ABUSE}	The vertigo is gonna grow 'cause it's so dangerous, you'll have to sign a waiver	MINT	2022-06-03 19:32:24.429124+00	\N	\N	COMPLETE
\.


--
-- Data for Name: plan_milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_milestones (id, model_plan_id, complete_icip, clearance_starts, clearance_ends, announced, applications_starts, applications_ends, performance_period_starts, performance_period_ends, wrap_up_ends, high_level_note, phased_in, phased_in_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
14909481-bf4e-4fa0-95b1-e00fb456f5be	53054496-6d1f-47f5-b6a0-1edaf73b935e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.85375+00	\N	\N	READY
9e0b09cb-1b4b-4925-9bff-d54d251fdc0c	95399697-8c37-4225-b09d-7ca4fd0ad2b0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.88433+00	\N	\N	READY
8d3dc2df-2fa1-4aaf-a152-884045cdf420	ce3405a0-3399-4e3a-88d7-3cfc613d2905	2022-06-03 17:41:40.962968+00	2022-06-03 17:41:40.96297+00	2022-06-03 17:41:40.962971+00	2022-06-03 17:41:40.962971+00	2022-06-03 17:41:40.962971+00	2022-06-03 17:41:40.962971+00	2022-06-03 17:41:40.962972+00	2022-06-03 17:41:40.962972+00	2022-06-03 17:41:40.962972+00	\N	t	\N	MINT	2022-06-03 17:41:40.920295+00	MINT	2022-06-03 17:41:40.970924+00	COMPLETE
c0a8bed5-5594-413d-890e-44de11bb0a60	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:41.017879+00	\N	\N	READY
08286528-6131-4d16-8162-eb2df66c046c	6e224030-09d5-46f7-ad04-4bb851b36eab	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	Theses are my best guess notes	f	This can't be phased in	MINT	2022-06-03 19:32:24.4141+00	\N	\N	COMPLETE
fb8602ce-eebc-46e8-b0ce-0b941c1adade	12897703-dac0-4e65-be7f-4907232eb176	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-06 13:10:45.725912+00	\N	\N	READY
\.


--
-- Data for Name: plan_participants_and_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_participants_and_providers (id, model_plan_id, participants, medicare_provider_type, states_engagement, participants_other, participants_note, participants_currently_in_models, participants_currently_in_models_note, model_application_level, expected_number_of_participants, estimate_confidence, confidence_note, recruitment_method, recruitment_other, recruitment_note, selection_method, selection_other, selection_note, communication_method, communication_note, participant_assume_risk, risk_type, risk_other, risk_note, will_risk_change, will_risk_change_note, coordinate_work, coordinate_work_note, gainshare_payments, gainshare_payments_track, gainshare_payments_note, participants_ids, participants_ids_other, participants_ids_note, provider_addition_frequency, provider_addition_frequency_other, provider_addition_frequency_note, provider_add_method, provider_add_method_other, provider_add_method_note, provider_leave_method, provider_leave_method_other, provider_leave_method_note, provider_overlap, provider_overlap_hierarchy, provider_overlap_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
da79bad2-b4ce-4975-80bf-bd6e71ae300f	ce3405a0-3399-4e3a-88d7-3cfc613d2905	{MEDICARE_PROVIDERS,STATES,OTHER}	Oncology Providers	States will determine administration specific to the state	The candy people	Additional participants might join at a later date	t	A good number of candy people participate in other models	 c92.00 and c92.01	26	SLIGHTLY	Confidence will increase as the year progresses	OTHER	We will put up signs throughout the kingdom	We will hire a contractor to put up the signs	{MODEL_TEAM_REVIEW_APPLICATIONS,OTHER}	Anyone who shows up to the open house on friday will automatically be selected	Open houses will be on a by weekly reoccurring basis	{MASS_EMAIL,OTHER}	If needed we will send text messages	t	OTHER	Programmatic Risk	This is specifically dependant on external factors 	t	Less risky as time goes on	t	Weekly meetings will be held	t	t	This only applies to the first 50 participants	{TINS,OTHER}	Candy Kingdom Operations Number	SSN can e used if the other ids are not avaialble	ANNUALLY	every other leap year	Exceptions can be made	{PROSPECTIVELY,OTHER}	Competitive ball-room dancing, free for all	Priority given to prospectively	{VOLUNTARILY_WITHOUT_IMPLICATIONS,OTHER}	When demanded by law	We don't expect this to be required by law in very many locations	YES_NEED_POLICIES	When overlap occurs, this model will be a secondary model	Extenuating circumstances can allow this model to be the dominate model	MINT	2022-06-03 17:41:41.053902+00	\N	\N	COMPLETE
b18d2f8c-e77b-4cbb-b992-25b43bec9d4f	6e224030-09d5-46f7-ad04-4bb851b36eab	{MEDICARE_PROVIDERS,STATES,OTHER}	Oncology Providers	States will determine administration specific to the state	The candy people	Additional participants might join at a later date	t	A good number of candy people participate in other models	c92.00 and c92.01	26	SLIGHTLY	Confidence will increase as the year progresses	OTHER	We will put up signs throughout the kingdom	We will hire a contractor to put up the signs	{MODEL_TEAM_REVIEW_APPLICATIONS,OTHER}	Anyone who shows up to the open house on friday will automatically be selected	Open houses will be on a by weekly reoccurring basis	{MASS_EMAIL,OTHER}	If needed we will send text messages	t	OTHER	Programmatic Risk	This is specifically dependant on external factors	t	Less risky as time goes on	t	Weekly meetings will be held	t	t	This only applies to the first 50 participants	{TINS,OTHER}	Candy Kingdom Operations Number	SSN can e used if the other ids are not avaialble	ANNUALLY	every other leap year	Exceptions can be made	{PROSPECTIVELY,OTHER}	Competitive ball-room dancing, free for all	Priority given to prospectively	{VOLUNTARILY_WITHOUT_IMPLICATIONS,OTHER}	When demanded by law	We don't expect this to be required by law in very many locations	YES_NEED_POLICIES	When overlap occurs, this model will be a secondary model	Extenuating circumstances can allow this model to be the dominate model	MINT	2022-06-03 19:32:24.434587+00	\N	\N	COMPLETE
5292bd87-2e21-4eff-9b04-3db41e8a209d	12897703-dac0-4e65-be7f-4907232eb176	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-06 13:10:45.731559+00	\N	\N	READY
\.


--
-- Name: discussion_reply discussion_reply_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discussion_reply
    ADD CONSTRAINT discussion_reply_pkey PRIMARY KEY (id);


--
-- Name: existing_model existing_model_model_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.existing_model
    ADD CONSTRAINT existing_model_model_name_key UNIQUE (model_name);


--
-- Name: existing_model existing_model_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.existing_model
    ADD CONSTRAINT existing_model_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: model_plan model_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_plan
    ADD CONSTRAINT model_plan_pkey PRIMARY KEY (id);


--
-- Name: plan_basics plan_basics_model_plan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_basics
    ADD CONSTRAINT plan_basics_model_plan_id_key UNIQUE (model_plan_id);


--
-- Name: plan_basics plan_basics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_basics
    ADD CONSTRAINT plan_basics_pkey PRIMARY KEY (id);


--
-- Name: plan_beneficiaries plan_beneficiaries_model_plan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_beneficiaries
    ADD CONSTRAINT plan_beneficiaries_model_plan_id_key UNIQUE (model_plan_id);


--
-- Name: plan_beneficiaries plan_beneficiaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_beneficiaries
    ADD CONSTRAINT plan_beneficiaries_pkey PRIMARY KEY (id);


--
-- Name: plan_collaborator plan_collaborator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_collaborator
    ADD CONSTRAINT plan_collaborator_pkey PRIMARY KEY (id);


--
-- Name: plan_discussion plan_discussion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_discussion
    ADD CONSTRAINT plan_discussion_pkey PRIMARY KEY (id);


--
-- Name: plan_document plan_document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_document
    ADD CONSTRAINT plan_document_pkey PRIMARY KEY (id);


--
-- Name: plan_general_characteristics plan_general_characteristics_model_plan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_general_characteristics
    ADD CONSTRAINT plan_general_characteristics_model_plan_id_key UNIQUE (model_plan_id);


--
-- Name: plan_general_characteristics plan_general_characteristics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_general_characteristics
    ADD CONSTRAINT plan_general_characteristics_pkey PRIMARY KEY (id);


--
-- Name: plan_milestones plan_milestones_model_plan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_milestones
    ADD CONSTRAINT plan_milestones_model_plan_id_key UNIQUE (model_plan_id);


--
-- Name: plan_milestones plan_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_milestones
    ADD CONSTRAINT plan_milestones_pkey PRIMARY KEY (id);


--
-- Name: plan_participants_and_providers plan_participants_and_providers_model_plan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_participants_and_providers
    ADD CONSTRAINT plan_participants_and_providers_model_plan_id_key UNIQUE (model_plan_id);


--
-- Name: plan_participants_and_providers plan_participants_and_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_participants_and_providers
    ADD CONSTRAINT plan_participants_and_providers_pkey PRIMARY KEY (id);


--
-- Name: plan_collaborator unique_collaborator_per_plan; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_collaborator
    ADD CONSTRAINT unique_collaborator_per_plan UNIQUE (model_plan_id, eua_user_id);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: plan_collaborator collaborator_lead_req_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER collaborator_lead_req_delete BEFORE DELETE ON public.plan_collaborator FOR EACH ROW WHEN ((old.team_role = 'MODEL_LEAD'::public.team_role)) EXECUTE PROCEDURE public.collaborator_role_check_trigger();


--
-- Name: plan_collaborator collaborator_lead_req_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER collaborator_lead_req_update BEFORE UPDATE ON public.plan_collaborator FOR EACH ROW WHEN (((old.team_role = 'MODEL_LEAD'::public.team_role) AND (new.team_role <> 'MODEL_LEAD'::public.team_role))) EXECUTE PROCEDURE public.collaborator_role_check_trigger();


--
-- Name: plan_basics fk_basics_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_basics
    ADD CONSTRAINT fk_basics_plan FOREIGN KEY (model_plan_id) REFERENCES public.model_plan(id);


--
-- Name: plan_beneficiaries fk_beneficiaries_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_beneficiaries
    ADD CONSTRAINT fk_beneficiaries_plan FOREIGN KEY (model_plan_id) REFERENCES public.model_plan(id);


--
-- Name: plan_general_characteristics fk_characteristics_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_general_characteristics
    ADD CONSTRAINT fk_characteristics_plan FOREIGN KEY (model_plan_id) REFERENCES public.model_plan(id);


--
-- Name: plan_collaborator fk_collaborator_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_collaborator
    ADD CONSTRAINT fk_collaborator_plan FOREIGN KEY (model_plan_id) REFERENCES public.model_plan(id);


--
-- Name: plan_discussion fk_discussion_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_discussion
    ADD CONSTRAINT fk_discussion_plan FOREIGN KEY (model_plan_id) REFERENCES public.model_plan(id);


--
-- Name: plan_document fk_document_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_document
    ADD CONSTRAINT fk_document_plan FOREIGN KEY (model_plan_id) REFERENCES public.model_plan(id);


--
-- Name: plan_milestones fk_milestones_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_milestones
    ADD CONSTRAINT fk_milestones_plan FOREIGN KEY (model_plan_id) REFERENCES public.model_plan(id);


--
-- Name: plan_participants_and_providers fk_participants_and_providers_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_participants_and_providers
    ADD CONSTRAINT fk_participants_and_providers_plan FOREIGN KEY (model_plan_id) REFERENCES public.model_plan(id);


--
-- Name: discussion_reply fk_reply_discussion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discussion_reply
    ADD CONSTRAINT fk_reply_discussion FOREIGN KEY (discussion_id) REFERENCES public.plan_discussion(id);


--
-- Name: TABLE discussion_reply; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.discussion_reply TO crud;


--
-- Name: TABLE existing_model; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.existing_model TO crud;


--
-- Name: TABLE flyway_schema_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.flyway_schema_history TO crud;


--
-- Name: TABLE model_plan; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.model_plan TO crud;


--
-- Name: TABLE plan_basics; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.plan_basics TO crud;


--
-- Name: TABLE plan_beneficiaries; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.plan_beneficiaries TO crud;


--
-- Name: TABLE plan_collaborator; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.plan_collaborator TO crud;


--
-- Name: TABLE plan_discussion; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.plan_discussion TO crud;


--
-- Name: TABLE plan_document; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.plan_document TO crud;


--
-- Name: TABLE plan_general_characteristics; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.plan_general_characteristics TO crud;


--
-- Name: TABLE plan_milestones; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.plan_milestones TO crud;


--
-- Name: TABLE plan_participants_and_providers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.plan_participants_and_providers TO crud;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT USAGE,UPDATE ON SEQUENCES  TO crud;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO crud;


--
-- PostgreSQL database dump complete
--
