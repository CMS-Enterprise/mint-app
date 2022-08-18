CREATE TABLE nda_agreement (
    id UUID PRIMARY KEY NOT NULL,
    --page 1
    user_id EUA_ID NOT NULL UNIQUE,
    accepted BOOLEAN NOT NULL,
    accepted_dts TIMESTAMP WITH TIME ZONE,
    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);
