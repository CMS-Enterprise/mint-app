CREATE TABLE plan_participants_and_providers (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    --page 1
    participants [] PARTICIPANTS_TYPE,
    medicare_provider_type text,
    states_engagement text,
    participants_other text,
    participants_note text,
    participants_currently_in_models bool,
    participants_currently_in_models_note text,
    model_application_level text,

    --page 2
    expected_number_of_participants int,
    estimate_confidence CONFIDENCE_TYPE,
    confidence_note text,
    recruitment_method RECRUITMENT_TYPE,
    recruitment_other text,
    recruitment_note text,
    selection_method [] PARTICIPANT_SELECTION_TYPE,
    selection_other text,
    selection_note text,

    --page 3
    communication_method [] PARTICIPANT_COMMUNICATION_TYPE,
    communication_note text,
    participant_assume_risk bool,
    risk_type PARTICIPANT_RISK_TYPE,
    risk_other text,
    risk_note text,
    will_risk_change bool,
    will_risk_change_note text,

    --page 4
    coordinate_work bool,
    coordinate_work_note text,
    gainshare_payments bool,
    gainshare_payments_method text,
    gainshare_payments_note text,
    participants_ids [] PARTICIPANTS_ID_TYPE,
    participants_ids_other text,
    participants_note text,

    --page 5
    provider_addition_frequency FREQUENCY_TYPE,
    provider_addition_frequency_other text,
    provider_addition_frequency_note text,
    provider_add_method [] PROVIDER_ADD_TYPE,
    provider_add_method_other text,
    provider_add_method_note text,
    provider_leave_method [] PROVIDER_LEAVE_TYPE,
    provider_leave_method_other text,
    provider_leave_method_note text,
    provider_overlap OVERLAP_TYPE,
    provider_overlap_hierarchy text,
    provider_overlap_note text


    --META
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY'
);

ALTER TABLE plan_participants_and_providers
ADD CONSTRAINT fk_participants_and_providers_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
