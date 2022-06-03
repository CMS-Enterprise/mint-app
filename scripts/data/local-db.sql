--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12 (Debian 11.12-1.pgdg90+1)
-- Dumped by pg_dump version 14.2

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
\.


--
-- Data for Name: plan_basics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_basics (id, model_plan_id, model_type, problem, goal, test_inventions, note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
1c12315a-5647-49cb-9371-8a0a2fa409a4	53054496-6d1f-47f5-b6a0-1edaf73b935e	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.847303+00	\N	\N	READY
f31f832d-b744-40b5-b881-dd264a3cd9f6	95399697-8c37-4225-b09d-7ca4fd0ad2b0	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.880114+00	\N	\N	READY
6680c61b-81cf-425c-adb1-d9e2ea356d9a	ce3405a0-3399-4e3a-88d7-3cfc613d2905	VOLUNTARY	The problem	The goal	The interventions	\N	MINT	2022-06-03 17:41:40.914497+00	MINT	2022-06-03 17:41:40.956661+00	COMPLETE
92a17c2e-4629-4b34-a0b0-2df0694d9113	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:41.012522+00	\N	\N	READY
\.


--
-- Data for Name: plan_beneficiaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_beneficiaries (id, model_plan_id, beneficiaries, beneficiaries_other, beneficiaries_note, treat_dual_elligible_different, treat_dual_elligible_different_how, treat_dual_elligible_different_note, exclude_certain_characteristics, exclude_certain_characteristics_criteria, exclude_certain_characteristics_note, number_people_impacted, estimate_confidence, confidence_note, beneficiary_selection_method, beneficiary_selection_other, beneficiary_selection_note, beneficiary_selection_frequency, beneficiary_selection_frequency_other, beneficiary_selection_frequency_note, beneficiary_overlap, beneficiary_overlap_note, precedence_rules, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
d3795217-240c-4d53-8219-7e618eecb19b	53054496-6d1f-47f5-b6a0-1edaf73b935e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.864778+00	\N	\N	READY
03733612-10f7-4d8f-ac3c-4d331bec2e1a	95399697-8c37-4225-b09d-7ca4fd0ad2b0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.898432+00	\N	\N	READY
c74858a1-1148-4bfc-a3fb-24f4e48f166f	ce3405a0-3399-4e3a-88d7-3cfc613d2905	\N	\N	\N	YES	\N	\N	TBD	\N	\N	500	NOT_AT_ALL	\N	\N	\N	\N	QUARTERLY	\N	\N	YES_NEED_POLICIES	\N	\N	MINT	2022-06-03 17:41:40.931363+00	MINT	2022-06-03 17:41:41.001616+00	COMPLETE
691e52f7-1964-47ff-b8d4-00f7c2c159c7	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:41.027163+00	\N	\N	READY
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
\.


--
-- Data for Name: plan_discussion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_discussion (id, model_plan_id, content, status, created_by, created_dts, modified_by, modified_dts) FROM stdin;
b092aaa9-a3a7-4802-ac10-0a5d58fb5d70	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	Why will nobody answer this!?	UNANSWERED	MINT	2022-06-03 17:41:41.030799+00	\N	\N
e847939b-dda7-48b8-88bc-99442017b0c2	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	Can someone please answer this?	ANSWERED	MINT	2022-06-03 17:41:41.033957+00	MINT	2022-06-03 17:41:41.048593+00
\.


--
-- Data for Name: plan_document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_document (id, model_plan_id, file_type, bucket, file_key, virus_scanned, virus_clean, file_name, file_size, document_type, other_type, optional_notes, deleted_at, created_by, created_dts, modified_by, modified_dts) FROM stdin;
\.


--
-- Data for Name: plan_general_characteristics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_general_characteristics (id, model_plan_id, is_new_model, existing_model, resembles_existing_model, resembles_existing_model_which, resembles_existing_model_how, resembles_existing_model_note, has_components_or_tracks, has_components_or_tracks_differ, has_components_or_tracks_note, alternative_payment_model, alternative_payment_model_types, alternative_payment_model_note, key_characteristics, key_characteristics_other, collect_plan_bids, collect_plan_bids_note, manage_part_c_d_enrollment, manage_part_c_d_enrollment_note, plan_contact_updated, plan_contact_updated_note, care_coordination_involved, care_coordination_involved_description, care_coordination_involved_note, additional_services_involved, additional_services_involved_description, additional_services_involved_note, community_partners_involved, community_partners_involved_description, community_partners_involved_note, geographies_targeted, geographies_targeted_types, geographies_targeted_types_other, geographies_targeted_applied_to, geographies_targeted_applied_to_other, geographies_targeted_note, participation_options, participation_options_note, agreement_types, agreement_types_other, multiple_patricipation_agreements_needed, multiple_patricipation_agreements_needed_note, rulemaking_required, rulemaking_required_description, rulemaking_required_note, authority_allowances, authority_allowances_other, authority_allowances_note, waivers_required, waivers_required_types, waivers_required_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
27d00d3e-7829-480a-bef7-833b1d74dabd	53054496-6d1f-47f5-b6a0-1edaf73b935e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.859484+00	\N	\N	READY
33d7c52b-1343-4a68-abe8-5fad733990ae	95399697-8c37-4225-b09d-7ca4fd0ad2b0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.893298+00	\N	\N	READY
7d390eb8-f647-4f6c-ab72-4bb7aff60f00	ce3405a0-3399-4e3a-88d7-3cfc613d2905	t	\N	f	\N	\N	\N	f	\N	\N	t	{REGULAR,MIPS}	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	t	Lots of additional services	\N	f	\N	\N	f	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	t	Lots of rules	\N	\N	\N	\N	f	\N	\N	MINT	2022-06-03 17:41:40.924851+00	MINT	2022-06-03 17:41:40.985636+00	COMPLETE
51e25d65-7d22-4f0e-98b5-2a1df252ab83	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:41.022457+00	\N	\N	READY
\.


--
-- Data for Name: plan_milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_milestones (id, model_plan_id, complete_icip, clearance_starts, clearance_ends, announced, applications_starts, applications_ends, performance_period_starts, performance_period_ends, wrap_up_ends, high_level_note, phased_in, phased_in_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
14909481-bf4e-4fa0-95b1-e00fb456f5be	53054496-6d1f-47f5-b6a0-1edaf73b935e	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.85375+00	\N	\N	READY
9e0b09cb-1b4b-4925-9bff-d54d251fdc0c	95399697-8c37-4225-b09d-7ca4fd0ad2b0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:40.88433+00	\N	\N	READY
8d3dc2df-2fa1-4aaf-a152-884045cdf420	ce3405a0-3399-4e3a-88d7-3cfc613d2905	2022-06-03 17:41:40.962968+00	2022-06-03 17:41:40.96297+00	2022-06-03 17:41:40.962971+00	2022-06-03 17:41:40.962971+00	2022-06-03 17:41:40.962971+00	2022-06-03 17:41:40.962971+00	2022-06-03 17:41:40.962972+00	2022-06-03 17:41:40.962972+00	2022-06-03 17:41:40.962972+00	\N	t	\N	MINT	2022-06-03 17:41:40.920295+00	MINT	2022-06-03 17:41:40.970924+00	COMPLETE
c0a8bed5-5594-413d-890e-44de11bb0a60	9371fdb5-3b05-4f58-aeec-f3f1739a8ab4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MINT	2022-06-03 17:41:41.017879+00	\N	\N	READY
\.


--
-- Data for Name: plan_participants_and_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_participants_and_providers (id, model_plan_id, participants, medicare_provider_type, states_engagement, participants_other, participants_note, participants_currently_in_models, participants_currently_in_models_note, model_application_level, expected_number_of_participants, estimate_confidence, confidence_note, recruitment_method, recruitment_other, recruitment_note, selection_method, selection_other, selection_note, communication_method, communication_note, participant_assume_risk, risk_type, risk_other, risk_note, will_risk_change, will_risk_change_note, coordinate_work, coordinate_work_note, gainshare_payments, gainshare_payments_track, gainshare_payments_note, participants_ids, participants_ids_other, participants_ids_note, provider_addition_frequency, provider_addition_frequency_other, provider_addition_frequency_note, provider_add_method, provider_add_method_other, provider_add_method_note, provider_leave_method, provider_leave_method_other, provider_leave_method_note, provider_overlap, provider_overlap_hierarchy, provider_overlap_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
b18d2f8c-e77b-4cbb-b992-25b43bec9d4f	ce3405a0-3399-4e3a-88d7-3cfc613d2905	{MEDICARE_PROVIDERS,STATES,OTHER}	Oncology Providers	States will determine administration specific to the state	The candy people	Additional participants might join at a later date	t	A good number of candy people participate in other models	 c92.00 and c92.01	26	SLIGHTLY	Confidence will increase as the year progresses	OTHER	We will put up signs throughout the kingdom	We will hire a contractor to put up the signs	{MODEL_TEAM_REVIEW_APPLICATIONS,OTHER}	Anyone who shows up to the open house on friday will automatically be selected	Open houses will be on a by weekly reoccurring basis	{MASS_EMAIL,OTHER}	If needed we will send text messages	t	OTHER	Programmatic Risk	This is specifically dependant on external factors 	t	Less risky as time goes on	t	Weekly meetings will be held	t	t	This only applies to the first 50 participants	{TINS,OTHER}	Candy Kingdom Operations Number	SSN can e used if the other ids are not avaialble	ANNUALLY	every other leap year	Exceptions can be made	{PROSPECTIVELY,OTHER}	Competitive ball-room dancing, free for all	Priority given to prospectively	{VOLUNTARILY_WITHOUT_IMPLICATIONS,OTHER}	When demanded by law	We don't expect this to be required by law in very many locations	YES_NEED_POLICIES	When overlap occurs, this model will be a secondary model	Extenuating circumstances can allow this model to be the dominate model	ABCD	2022-06-03 17:41:41.053902+00	\N	\N	COMPLETE
\.


--
-- Name: discussion_reply discussion_reply_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discussion_reply
    ADD CONSTRAINT discussion_reply_pkey PRIMARY KEY (id);


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
