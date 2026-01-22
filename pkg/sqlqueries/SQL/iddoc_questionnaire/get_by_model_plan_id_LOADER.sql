WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    iddoc.id,
    iddoc.model_plan_id,
    iddoc.technical_contacts_identified,
    iddoc.technical_contacts_identified_detail,
    iddoc.technical_contacts_identified_note,
    iddoc.capture_participant_information,
    iddoc.capture_participant_info_note,
    iddoc.icd_owner,
    iddoc.draft_icd_required_by,
    iddoc.icd_note,
    iddoc.uat_test_data_needs,
    iddoc.stc_test_data_needs,
    iddoc.testing_timelines,
    iddoc.testing_note,
    iddoc.file_types,
    iddoc.data_monitoring_file_other,
    iddoc.response_types,
    iddoc.file_frequency,
    iddoc.data_full_time_or_incremental,
    iddoc.eft_connectivity_setup,
    iddoc.unsolicited_adjustments_included,
    iddoc.data_flow_diagrams_needed,
    iddoc.produce_benefit_enhancement_files,
    iddoc.file_naming_conventions,
    iddoc.data_monitoring_note,
    iddoc.load_type,
    iddoc.needed,
    iddoc.completed_by,
    iddoc.completed_dts,
    iddoc.created_by,
    iddoc.created_dts,
    iddoc.modified_by,
    iddoc.modified_dts
FROM iddoc_questionnaire AS iddoc
INNER JOIN QUERIED_IDS ON iddoc.model_plan_id = QUERIED_IDS.model_plan_id
