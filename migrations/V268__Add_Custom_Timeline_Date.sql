CREATE TYPE CUSTOM_TIMELINE_DATE_TYPE AS ENUM (
    'SINGLE',
    'RANGE'
);

CREATE TABLE IF NOT EXISTS custom_timeline_dates (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    title TEXT NOT NULL,
    description ZERO_STRING,
    date_type CUSTOM_TIMELINE_DATE_TYPE NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE,
    -- require `end_date` if `date_type` is `RANGE`
    -- forbid `end_date` if `date_type` is `SINGLE`
    CONSTRAINT custom_timeline_dates_date_type_end_date CHECK (
        (
            date_type = 'RANGE'
            AND end_date IS NOT NULL
        )
        OR
        (
            date_type = 'SINGLE'
            AND end_date IS NULL
        )
    )
);
