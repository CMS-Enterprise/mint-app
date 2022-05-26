CREATE TYPE BENEFICIARIES_TYPE AS ENUM (
    'MEDICARE_FFS',
    'MEDICARE_ADVANTAGE',
    'MEDICARE_PART_D',
    'MEDICAID',
    'DUALLY_ELIGIBLE',
    'DISEASE_SPECIFIC',
    'OTHER',
    'NA'
);

CREATE TYPE CONFIDENCE_TYPE AS ENUM (
    'NOT_AT_ALL',
    'SLIGHTLY',
    'FAIRLY',
    'COMPLETELY'
);

CREATE TYPE SELECTION_METHOD_TYPE AS ENUM (
    'HISTORICAL',
    'PROSPECTIVE',
    'RETROSPECTIVE',
    'VOLUNTARY',
    'PROVIDER_SIGN_UP',
    'OTHER',
    'NA'
);

CREATE TYPE SELECTION_FREQUENCY_TYPE AS ENUM (
    'ANNUALLY',
    'BIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'ROLLING',
    'OTHER'
);

CREATE TYPE OVERLAP_TYPE AS ENUM (
    'YES_NEED_POLICIES',
    'YES_NO_ISSUES',
    'NO'

);


CREATE TABLE plan_beneficiaries (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    --page 1
    beneficiaries BENEFICIARIES_TYPE[],
    beneficiaries_other TEXT,
    beneficiaries_note TEXT,
    treat_dual_elligible_different TRI_STATE_ANSWER,
    treat_dual_elligible_different_how TEXT,
    treat_dual_elligible_different_note TEXT,
    exclude_certain_characteristics TEXT,
    exclude_certain_characteristics_criteria TEXT,
    exclude_certain_characteristics_note TEXT,
    -- page 2
    number_people_impacted INT,
    estimate_confidence CONFIDENCE_TYPE,
    confidence_note TEXT,
    beneficiary_selection_method SELECTION_METHOD_TYPE[],
    beneficiary_selection_other TEXT,
    beneficiary_selection_note TEXT,
    --page 3
    beneficiary_selection_frequency SELECTION_FREQUENCY_TYPE,
    beneficiary_selection_frequency_other TEXT,
    beneficiary_selection_frequency_note TEXT,
    beneficiary_overlap OVERLAP_TYPE,
    beneficiary_overlap_note TEXT,
    precedence_rules TEXT,

    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY'

);
