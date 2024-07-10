CREATE TABLE data_exchange_approach (
                                      id UUID PRIMARY KEY NOT NULL,
                                      model_plan_id UUID NOT NULL REFERENCES model_plan(id),
                                      high_level_overview ZERO_STRING,
                                      new_methods ZERO_STRING,
                                      feasibility ZERO_STRING,
                                      participant_burden ZERO_STRING,
                                      cmmi_impact ZERO_STRING,
                                      additional_considerations ZERO_STRING,

  -- META DATA
                                      created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE NOT NULL,
                                      created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
                                      modified_dts TIMESTAMP WITH TIME ZONE,
                                      ready_for_review_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
                                      ready_for_review_dts TIMESTAMP WITH TIME ZONE,
                                      ready_for_clearance_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
                                      ready_for_clearance_dts TIMESTAMP WITH TIME ZONE,
                                      status TASK_STATUS NOT NULL DEFAULT 'READY'
);

COMMENT ON COLUMN data_exchange_approach.high_level_overview IS 'Provide a high-level overview of how you anticipate exchanging data with participants.';
COMMENT ON COLUMN data_exchange_approach.new_methods IS 'Do you plan to implement any new or novel data exchange methods based on new technologies or policy initiatives?';
COMMENT ON COLUMN data_exchange_approach.feasibility IS 'Is the model’s data exchange approach realistic and feasible given the current state of health IT standards, technology availability, and vendor capability?';
COMMENT ON COLUMN data_exchange_approach.participant_burden IS 'Please describe the participant burden anticipated as a result of these data exchange requirements.';
COMMENT ON COLUMN data_exchange_approach.cmmi_impact IS 'How does the data exchange approach impact CMMI?';
COMMENT ON COLUMN data_exchange_approach.additional_considerations IS 'Please describe any additional considerations.';
