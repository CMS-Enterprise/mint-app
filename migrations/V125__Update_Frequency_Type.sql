/***
Section: Update FREQUENCY_TYPE enum
***/

-- create type frequency_type as enum ('ANNUALLY', 'BIANNUALLY', 'QUARTERLY', 'MONTHLY', 'ROLLING', 'OTHER');

ALTER TYPE FREQUENCY_TYPE
    RENAME TO FREQUENCY_TYPE_OLD;

ALTER TYPE FREQUENCY_TYPE_OLD
    ADD VALUE 'SEMIANNUALLY';

ALTER TYPE FREQUENCY_TYPE_OLD
    ADD VALUE 'CONTINUALLY';

CREATE TYPE FREQUENCY_TYPE AS ENUM (
    'ANNUALLY'
    'SEMIANNUALLY'
    'QUARTERLY'
    'MONTHLY'
    'CONTINUALLY'
    'OTHER'
    );

/***
Section: Alter plan_beneficiaries to use this new type
***/

UPDATE plan_beneficiaries
    SET beneficiary_selection_frequency = 'SEMIANNUALLY'
    WHERE beneficiary_selection_frequency = 'BIANNUALLY';

UPDATE plan_beneficiaries
    SET beneficiary_selection_frequency = 'CONTINUALLY'
    WHERE beneficiary_selection_frequency = 'ROLLING';

ALTER TABLE plan_beneficiaries
    ALTER COLUMN beneficiary_selection_frequency TYPE FREQUENCY_TYPE USING beneficiary_selection_frequency::TEXT::FREQUENCY_TYPE;

ALTER TABLE plan_participants_and_providers
    ALTER COLUMN provider_addition_frequency TYPE FREQUENCY_TYPE USING provider_addition_frequency::TEXT::FREQUENCY_TYPE;

DROP TYPE FREQUENCY_TYPE_OLD;
