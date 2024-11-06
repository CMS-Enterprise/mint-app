WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    approach.id,
    approach.model_plan_id,
    approach.data_to_collect_from_participants,
    approach.data_to_collect_from_participants_reports_details,
    approach.data_to_collect_from_participants_other,
    approach.data_will_not_be_collected_from_participants,
    approach.data_to_collect_from_participants_note,
    approach.data_to_send_to_participants,
    approach.data_to_send_to_participants_note,
    approach.does_need_to_make_multi_payer_data_available,
    approach.anticipated_multi_payer_data_availability_use_case,
    approach.does_need_to_make_multi_payer_data_available_note,
    approach.does_need_to_collect_and_aggregate_multi_source_data,
    approach.multi_source_data_to_collect,
    approach.multi_source_data_to_collect_other,
    approach.does_need_to_collect_and_aggregate_multi_source_data_note,
    approach.will_implement_new_data_exchange_methods,
    approach.new_data_exchange_methods_description,
    approach.new_data_exchange_methods_note,
    approach.additional_data_exchange_considerations_description,
    approach.created_by,
    approach.created_dts,
    approach.modified_by,
    approach.modified_dts,
    approach.marked_complete_by,
    approach.marked_complete_dts,
    approach.status
FROM plan_data_exchange_approach AS approach
INNER JOIN QUERIED_IDS ON approach.model_plan_id = QUERIED_IDS.model_plan_id
