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

--
-- Data for Name: model_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.model_plan (id, model_name, model_category, cms_centers, cms_other, cmmi_groups, archived, status, created_by, created_dts, modified_by, modified_dts) FROM stdin;
6e224030-09d5-46f7-ad04-4bb851b36eab	PM Butler's great plan	PRIMARY_CARE_TRANSFORMATION	{CENTER_FOR_MEDICARE,OTHER}	The Center for Awesomeness	{STATE_INNOVATIONS_GROUP,POLICY_AND_PROGRAMS_GROUP}	f	PLAN_COMPLETE	MINT	2022-06-03 19:32:24.356021+00	MINT	2022-06-03 20:56:30.06897+00
\.


--
-- Data for Name: plan_discussion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_discussion (id, model_plan_id, content, status, created_by, created_dts, modified_by, modified_dts) FROM stdin;
550dfb5f-b730-4e7f-a991-aca280f0298b	6e224030-09d5-46f7-ad04-4bb851b36eab	What is the purpose of this plan?	ANSWERED	JAKE	2022-06-03 19:32:24.416474+00	\N	\N
\.


--
-- Data for Name: discussion_reply; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discussion_reply (id, discussion_id, content, resolution, created_by, created_dts, modified_by, modified_dts) FROM stdin;
\.


--
-- Data for Name: plan_basics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_basics (id, model_plan_id, model_type, problem, goal, test_interventions, note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
4132e334-4a10-4e8e-9ef1-a72fe910dc82	6e224030-09d5-46f7-ad04-4bb851b36eab	MANDATORY	There is not enough candy	To get more candy	The great candy machine	The machine doesn't work yet	MINT	2022-06-03 19:32:24.411254+00	MINT	2022-06-03 20:54:20.096083+00	COMPLETE
\.


--
-- Data for Name: plan_beneficiaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_beneficiaries (id, model_plan_id, beneficiaries, beneficiaries_other, beneficiaries_note, treat_dual_elligible_different, treat_dual_elligible_different_how, treat_dual_elligible_different_note, exclude_certain_characteristics, exclude_certain_characteristics_criteria, exclude_certain_characteristics_note, number_people_impacted, estimate_confidence, confidence_note, beneficiary_selection_method, beneficiary_selection_other, beneficiary_selection_note, beneficiary_selection_frequency, beneficiary_selection_frequency_other, beneficiary_selection_frequency_note, beneficiary_overlap, beneficiary_overlap_note, precedence_rules, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
b7aa2c9f-9e38-4e95-92d9-60bd791e8c59	6e224030-09d5-46f7-ad04-4bb851b36eab	{MEDICARE_FFS,DISEASE_SPECIFIC,OTHER}	The Gumdrop Kids	The disease is kidney failure	YES	Priority given to kidney failure	Can be overridden by vice-presidential order	YES	Exclude any individuals who qualify for 5 other models	Exceptions can be made by presidential order	25	SLIGHTLY	This is probably correct	{PROVIDER_SIGN_UP,OTHER}	Competitive wrestling, elimination style	Priority given to provider sign up	ANNUALLY	On February 29th when it occurs	Also as needed	YES_NEED_POLICIES	This will likely overlap	This takes precendence over all other models	MINT	2022-06-03 19:32:24.432349+00	\N	\N	READY
\.


--
-- Data for Name: plan_collaborator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_collaborator (id, model_plan_id, eua_user_id, full_name, team_role, created_by, created_dts, modified_by, modified_dts) FROM stdin;
38a59d7a-fc37-4bda-acec-ffd44bf8b4d2	6e224030-09d5-46f7-ad04-4bb851b36eab	PBLR	PM Butler	MODEL_LEAD	MINT	2022-06-03 20:58:45.560727+00	MINT	2022-06-03 20:59:28.411263+00
f1b90915-c863-405a-b4ad-4558e01791f0	6e224030-09d5-46f7-ad04-4bb851b36eab	MINT	mint Doe	LEADERSHIP	MINT	2022-06-03 19:32:24.408045+00	MINT	2022-06-03 20:59:34.235474+00
\.


--
-- Data for Name: plan_document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_document (id, model_plan_id, file_type, bucket, file_key, virus_scanned, virus_clean, file_name, file_size, document_type, other_type, optional_notes, deleted_at, created_by, created_dts, modified_by, modified_dts) FROM stdin;
39536488-354e-4cd8-a8c6-1647f2a56c4e	6e224030-09d5-46f7-ad04-4bb851b36eab	application/pdf	mint-app-file-uploads	25c81e5a-4940-45fe-85c7-fcbe37a3c317.pdf	f	f	sample.pdf	3028	OTHER	Sample Document	Virus scan should be infected	\N	MINT	2022-06-06 13:11:24.674723+00	\N	\N
13044089-956b-476e-8b86-a1a521ffde59	6e224030-09d5-46f7-ad04-4bb851b36eab	application/pdf	mint-app-file-uploads	b23d964c-3e44-426b-8dcb-aa979adc07a2.pdf	f	f	sample.pdf	3028	CONCEPT_PAPER	\N	Virus scan should be clean	\N	MINT	2022-06-06 13:11:01.286371+00	\N	\N
e2416f82-2847-4e12-a9c0-5ccea325ea92	6e224030-09d5-46f7-ad04-4bb851b36eab	application/pdf	mint-app-file-uploads	3225ae75-8ca7-4b78-aa7e-ea2334226c07.pdf	f	f	sample.pdf	3028	MARKET_RESEARCH	\N	Virus scan should be pending	\N	MINT	2022-06-06 13:11:13.342637+00	\N	\N
\.


--
-- Data for Name: plan_general_characteristics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_general_characteristics (id, model_plan_id, is_new_model, existing_model, resembles_existing_model, resembles_existing_model_which, resembles_existing_model_how, resembles_existing_model_note, has_components_or_tracks, has_components_or_tracks_differ, has_components_or_tracks_note, alternative_payment_model, alternative_payment_model_types, alternative_payment_model_note, key_characteristics, key_characteristics_other, key_characteristics_note, collect_plan_bids, collect_plan_bids_note, manage_part_c_d_enrollment, manage_part_c_d_enrollment_note, plan_contact_updated, plan_contact_updated_note, care_coordination_involved, care_coordination_involved_description, care_coordination_involved_note, additional_services_involved, additional_services_involved_description, additional_services_involved_note, community_partners_involved, community_partners_involved_description, community_partners_involved_note, geographies_targeted, geographies_targeted_types, geographies_targeted_types_other, geographies_targeted_applied_to, geographies_targeted_applied_to_other, geographies_targeted_note, participation_options, participation_options_note, agreement_types, agreement_types_other, multiple_patricipation_agreements_needed, multiple_patricipation_agreements_needed_note, rulemaking_required, rulemaking_required_description, rulemaking_required_note, authority_allowances, authority_allowances_other, authority_allowances_note, waivers_required, waivers_required_types, waivers_required_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
41a11243-c0c8-4b6c-8a10-e8b0cbaa03b2	6e224030-09d5-46f7-ad04-4bb851b36eab	t	My Existing Model	t	{"Exist Model 1","Exist Model 2"}	They both have a similar approach to payment	Check the payment section of the existing models	t	One track does something one way, the other does it another way	Look at the tracks carefully	t	{MIPS,ADVANCED}	Has 2 APM types!	{PART_C,PART_D,OTHER}	It's got lots of class and character	other characteristics might still be discovered	t	It collects SOOO many plan bids you wouldn't even get it broh	f	It definitely will not manage Part C/D enrollment, are you crazy??	f	I forgot to update it, but will soon	t	It just is!	Just think about it	f	\N	\N	t	Very involved in the community	Check the community partners section	t	{STATE,OTHER}	The WORLD!	{PARTICIPANTS,OTHER}	All Humans	\N	t	Really anyone can participate	{OTHER}	A firm handshake	f	A firm handshake should be more than enough	t	The golden rule - target date of 05/08/2023	\N	{CONGRESSIONALLY_MANDATED}	\N	\N	t	{FRAUD_ABUSE}	The vertigo is gonna grow 'cause it's so dangerous, you'll have to sign a waiver	MINT	2022-06-03 19:32:24.429124+00	\N	\N	COMPLETE
\.


--
-- Data for Name: plan_it_tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_it_tools (id, model_plan_id, gc_part_c_d, gc_part_c_d_other, gc_part_c_d_note, gc_collect_bids, gc_collect_bids_other, gc_collect_bids_note, gc_update_contract, gc_update_contract_other, gc_update_contract_note, pp_to_advertise, pp_to_advertise_other, pp_to_advertise_note, pp_collect_score_review, pp_collect_score_review_other, pp_collect_score_review_note, pp_app_support_contractor, pp_app_support_contractor_other, pp_app_support_contractor_note, pp_communicate_with_participant, pp_communicate_with_participant_other, pp_communicate_with_participant_note, pp_manage_provider_overlap, pp_manage_provider_overlap_other, pp_manage_provider_overlap_note, b_manage_beneficiary_overlap, b_manage_beneficiary_overlap_other, b_manage_beneficiary_overlap_note, oel_helpdesk_support, oel_helpdesk_support_other, oel_helpdesk_support_note, oel_manage_aco, oel_manage_aco_other, oel_manage_aco_note, oel_performance_benchmark, oel_performance_benchmark_other, oel_performance_benchmark_note, oel_process_appeals, oel_process_appeals_other, oel_process_appeals_note, oel_evaluation_contractor, oel_evaluation_contractor_other, oel_evaluation_contractor_note, oel_collect_data, oel_collect_data_other, oel_collect_data_note, oel_obtain_data, oel_obtain_data_other, oel_obtain_data_note, oel_claims_based_measures, oel_claims_based_measures_other, oel_claims_based_measures_note, oel_quality_scores, oel_quality_scores_other, oel_quality_scores_note, oel_send_reports, oel_send_reports_other, oel_send_reports_note, oel_learning_contractor, oel_learning_contractor_other, oel_learning_contractor_note, oel_participant_collaboration, oel_participant_collaboration_other, oel_participant_collaboration_note, oel_educate_beneficiaries, oel_educate_beneficiaries_other, oel_educate_beneficiaries_note, p_make_claims_payments, p_make_claims_payments_other, p_make_claims_payments_note, p_inform_ffs, p_inform_ffs_other, p_inform_ffs_note, p_non_claims_based_payments, p_non_claims_based_payments_other, p_non_claims_based_payments_note, p_shared_savings_plan, p_shared_savings_plan_other, p_shared_savings_plan_note, p_recover_payments, p_recover_payments_other, p_recover_payments_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
415a1119-fde9-48de-999a-05475705ac5d	6e224030-09d5-46f7-ad04-4bb851b36eab	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	{OTHER}	Something Different	This will be determined later	MINT	2022-06-15 16:54:01.124177+00	MINT	2022-06-15 16:54:36.130224+00	READY
\.


--
-- Data for Name: plan_milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_milestones (id, model_plan_id, complete_icip, clearance_starts, clearance_ends, announced, applications_starts, applications_ends, performance_period_starts, performance_period_ends, wrap_up_ends, high_level_note, phased_in, phased_in_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
08286528-6131-4d16-8162-eb2df66c046c	6e224030-09d5-46f7-ad04-4bb851b36eab	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	2022-06-03 19:32:24.412662+00	Theses are my best guess notes	f	This can't be phased in	MINT	2022-06-03 19:32:24.4141+00	\N	\N	COMPLETE
\.


--
-- Data for Name: plan_ops_eval_and_learning; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_ops_eval_and_learning (id, model_plan_id, agency_or_state_help, agency_or_state_help_other, agency_or_state_help_note, stakeholders, stakeholders_other, stakeholders_note, helpdesk_use, helpdesk_use_note, contractor_support, contractor_support_other, contractor_support_how, contractor_support_note, iddoc_support, iddoc_support_note, technical_contacts_identified, technical_contacts_identified_detail, technical_contacts_identified_note, capture_participant_info, capture_participant_info_note, icd_owner, draft_icd_due_date, icd_note, uat_needs, stc_needs, testing_timelines, testing_note, data_monitoring_file_types, data_monitoring_file_other, data_response_type, data_response_file_frequency, data_full_time_or_incremental, eft_set_up, unsolicited_adjustments_included, data_flow_diagrams_needed, produce_benefit_enhancement_files, file_naming_conventions, data_monitoring_note, benchmark_for_performance, benchmark_for_performance_note, compute_performance_scores, compute_performance_scores_note, risk_adjust_performance, risk_adjust_feedback, risk_adjust_payments, risk_adjust_other, risk_adjust_note, appeal_performance, appeal_feedback, appeal_payments, appeal_other, appeal_note, evaluation_approaches, evaluation_approach_other, evalutaion_approach_note, ccm_involvment, ccm_involvment_other, ccm_involvment_note, data_needed_for_monitoring, data_needed_for_monitoring_other, data_needed_for_monitoring_note, data_to_send_particicipants, data_to_send_particicipants_other, data_to_send_particicipants_note, share_cclf_data, share_cclf_data_note, send_files_between_ccw, send_files_between_ccw_note, app_to_send_files_to_known, app_to_send_files_to_which, app_to_send_files_to_note, use_ccw_for_file_distribiution_to_participants, use_ccw_for_file_distribiution_to_participants_note, develop_new_quality_measures, develop_new_quality_measures_note, quality_performance_impacts_payment, quality_performance_impacts_payment_note, data_sharing_starts, data_sharing_starts_other, data_sharing_frequency, data_sharing_frequency_other, data_sharing_starts_note, data_collection_starts, data_collection_starts_other, data_collection_frequency, data_collection_frequency_other, data_collection_frequency_note, quality_reporting_starts, quality_reporting_starts_other, quality_reporting_starts_note, model_learning_systems, model_learning_systems_other, model_learning_systems_note, anticipated_challenges, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
8a747c78-3298-4800-a02d-22801934079c	6e224030-09d5-46f7-ad04-4bb851b36eab	{YES_STATE,OTHER}	Department of Motor Vehicles	cursory information related to accidents	{BENEFICIARIES,OTHER}	oncology organizations	These stakeholders might change	t	other support will be just in time hiring	{ONE,OTHER}	Multiple to support design	They will provide wireframes of workflows	see note	t	unsure of all spcifications at this moment	t	Bill in accounting	Bill is an expert	t	Every user will have this info captured	Bill in Accounting	2022-12-25 00:00:00+00	must have by the 25th	Users to make sure this works correctly	Realistic information needed to ensure accuracy	testing will start in October, and hsould conclude by the 1st of December	test needs might change	{BENEFICIARY,OTHER}	suplementary	survey responses	Every 3 weeks	INCREMENTAL	t	t	t	t	files start with s and are .xslx files	other file names will be discarded	YES_RECONCILE	tbd	t	this will be necessary	t	t	t	t	this is important	t	t	t	t	tbd	{CONTROL_INTERVENTION,OTHER}	A New algorithym	algorhythm tbd	{YES_EVALUATION,OTHER}	yes for other advice as needed	other advice needed tBD	{NON_MEDICAL_DATA,OTHER}	Cholesterol data	cholesterol data will show us if treatment is following it's intended goal	{BASELINE_HISTORICAL_DATA,OTHER_MIPS_DATA}	usage of health care information	TBD	t	TBD	t	this is anticipated	t	SharePoint	SharePoint instanc to be determined later	t	this will be helpful	t	This will enable better data	t	higher quality measures = higher payment	OTHER	the next leap year	{ANNUALLY,OTHER}	yearly, and on every feb 29	frequency might change as the model grows	OTHER	The next year after the next leap year	{ANNUALLY,OTHER}	yearly, and on every feb 29	frequency might change as the model grows	OTHER	the third leap year from now	if this is beyond 5 years from now, start on year 5	{LEARNING_CONTRACTOR,OTHER}	We will make our own in house learning system	We will use exisitng SW dev staff	We might not have complete staffing for this. We might need to use more contractors than previously anticipated.	MINT	2022-06-03 17:41:40.907249+00	MINT	2022-06-09 23:06:56.059094+00	COMPLETE
\.


--
-- Data for Name: plan_participants_and_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_participants_and_providers (id, model_plan_id, participants, medicare_provider_type, states_engagement, participants_other, participants_note, participants_currently_in_models, participants_currently_in_models_note, model_application_level, expected_number_of_participants, estimate_confidence, confidence_note, recruitment_method, recruitment_other, recruitment_note, selection_method, selection_other, selection_note, communication_method, communication_method_other, communication_note, participant_assume_risk, risk_type, risk_other, risk_note, will_risk_change, will_risk_change_note, coordinate_work, coordinate_work_note, gainshare_payments, gainshare_payments_track, gainshare_payments_note, participants_ids, participants_ids_other, participants_ids_note, provider_addition_frequency, provider_addition_frequency_other, provider_addition_frequency_note, provider_add_method, provider_add_method_other, provider_add_method_note, provider_leave_method, provider_leave_method_other, provider_leave_method_note, provider_overlap, provider_overlap_hierarchy, provider_overlap_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
b18d2f8c-e77b-4cbb-b992-25b43bec9d4f	6e224030-09d5-46f7-ad04-4bb851b36eab	{MEDICARE_PROVIDERS,STATES,OTHER}	Oncology Providers	States will determine administration specific to the state	The candy people	Additional participants might join at a later date	t	A good number of candy people participate in other models	c92.00 and c92.01	26	SLIGHTLY	Confidence will increase as the year progresses	OTHER	We will put up signs throughout the kingdom	We will hire a contractor to put up the signs	{MODEL_TEAM_REVIEW_APPLICATIONS,OTHER}	Anyone who shows up to the open house on friday will automatically be selected	Open houses will be on a by weekly reoccurring basis	{MASS_EMAIL,OTHER}	\N	If needed we will send text messages	t	OTHER	Programmatic Risk	This is specifically dependant on external factors	t	Less risky as time goes on	t	Weekly meetings will be held	t	t	This only applies to the first 50 participants	{TINS,OTHER}	Candy Kingdom Operations Number	SSN can e used if the other ids are not avaialble	ANNUALLY	every other leap year	Exceptions can be made	{PROSPECTIVELY,OTHER}	Competitive ball-room dancing, free for all	Priority given to prospectively	{VOLUNTARILY_WITHOUT_IMPLICATIONS,OTHER}	When demanded by law	We don't expect this to be required by law in very many locations	YES_NEED_POLICIES	When overlap occurs, this model will be a secondary model	Extenuating circumstances can allow this model to be the dominate model	MINT	2022-06-03 19:32:24.434587+00	\N	\N	COMPLETE
\.


--
-- Data for Name: plan_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_payments (id, model_plan_id, funding_source, funding_source_trust_fund, funding_source_other, funding_source_note, funding_source_r, funding_source_r_trust_fund, funding_source_r_other, funding_source_r_note, pay_recipients, pay_recipients_other_specification, pay_recipients_note, pay_type, pay_type_note, pay_claims, pay_claims_other, pay_claims_note, should_any_providers_excluded_ffs_systems, should_any_providers_excluded_ffs_systems_note, changes_medicare_physician_fee_schedule, changes_medicare_physician_fee_schedule_note, affects_medicare_secondary_payer_claims, affects_medicare_secondary_payer_claims_how, affects_medicare_secondary_payer_claims_note, pay_model_differentiation, creating_dependencies_between_services, creating_dependencies_between_services_note, needs_claims_data_collection, needs_claims_data_collection_note, providing_third_party_file, is_contractor_aware_test_data_requirements, beneficiary_cost_sharing_level_and_handling, waive_beneficiary_cost_sharing_for_any_services, waive_beneficiary_cost_sharing_service_specification, waiver_only_applies_part_of_payment, waive_beneficiary_cost_sharing_note, non_claims_payments, non_claims_payments_other, payment_calculation_owner, number_payments_per_pay_cycle, number_payments_per_pay_cycle_note, shared_systems_involved_additional_claim_payment, shared_systems_involved_additional_claim_payment_note, planning_to_use_innovation_payment_contractor, planning_to_use_innovation_payment_contractor_note, funding_structure, expected_calculation_complexity_level, expected_calculation_complexity_level_note, can_participants_select_between_payment_mechanisms, can_participants_select_between_payment_mechanisms_how, can_participants_select_between_payment_mechanisms_note, anticipated_payment_frequency, anticipated_payment_frequency_other, anticipated_payment_frequency_note, will_recover_payments, will_recover_payments_note, anticipate_reconciling_payments_retrospectively, anticipate_reconciling_payments_retrospectively_note, payment_start_date, payment_start_date_note, created_by, created_dts, modified_by, modified_dts, status) FROM stdin;
a18d2f8c-e5cb-4c5d-b21c-3554dbec9c51	6e224030-09d5-46f7-ad04-4bb851b36eab	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	FAKE	2022-07-05 13:44:44.380055+00	\N	\N	READY
\.


--
-- PostgreSQL database dump complete
--
