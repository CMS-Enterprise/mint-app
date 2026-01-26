WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[]))  AS id
)

SELECT
    iddoc.id,
    iddoc.model_plan_id,
    iddoc.technical_contacts_identified,
    iddoc.technical_contacts_identified_detail,
    iddoc.technical_contacts_identified_note,
    iddoc.capture_participant_info,
    iddoc.capture_participant_info_note,
    iddoc.icd_owner,
    iddoc.draft_icd_due_date,
    iddoc.icd_note,
    iddoc.uat_needs,
    iddoc.stc_needs,
    iddoc.testing_timelines,
    iddoc.testing_note,
    iddoc.data_monitoring_file_types,
    iddoc.data_monitoring_file_other,
    iddoc.data_response_type,
    iddoc.data_response_file_frequency,
    iddoc.data_full_time_or_incremental,
    iddoc.eft_set_up,
    iddoc.unsolicited_adjustments_included,
    iddoc.data_flow_diagrams_needed,
    iddoc.produce_benefit_enhancement_files,
    iddoc.file_naming_conventions,
    iddoc.data_monitoring_note,
    iddoc.needed,
    iddoc.is_iddoc_questionnaire_complete,
    iddoc.completed_by,
    iddoc.completed_dts,
    iddoc.created_by,
    iddoc.created_dts,
    iddoc.modified_by,
    iddoc.modified_dts
FROM iddoc_questionnaire AS iddoc
INNER JOIN QUERIED_IDS ON iddoc.id = QUERIED_IDS.id
