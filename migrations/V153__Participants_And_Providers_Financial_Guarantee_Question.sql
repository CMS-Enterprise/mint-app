CREATE TYPE PARTICIPANT_REQUIRE_FINANCIAL_GUARANTEE_TYPE AS ENUM (
    'SURETY_BOND',
    'LETTER_OF_CREDIT',
    'ESCROW',
    'OTHER'
);
COMMENT ON TYPE PARTICIPANT_REQUIRE_FINANCIAL_GUARANTEE_TYPE IS 'Enumerated type for different types of financial guarantees that participants may require.';

ALTER TABLE plan_participants_and_providers
ADD COLUMN participant_require_financial_guarantee BOOLEAN,
ADD COLUMN participant_require_financial_guarantee_type PARTICIPANT_REQUIRE_FINANCIAL_GUARANTEE_TYPE[],
ADD COLUMN participant_require_financial_guarantee_other  ZERO_STRING,
ADD COLUMN participant_require_financial_guarantee_note  ZERO_STRING;

COMMENT ON COLUMN plan_participants_and_providers.participant_require_financial_guarantee IS 'Indicates whether participants require a financial guarantee.';
COMMENT ON COLUMN plan_participants_and_providers.participant_require_financial_guarantee_type IS 'Stores the types of financial guarantees required by participants.';
COMMENT ON COLUMN plan_participants_and_providers.participant_require_financial_guarantee_other IS 'Stores other types of financial guarantees if "OTHER" is selected.';
COMMENT ON COLUMN plan_participants_and_providers.participant_require_financial_guarantee_note IS 'Stores additional notes or details about financial guarantee requirements.';
