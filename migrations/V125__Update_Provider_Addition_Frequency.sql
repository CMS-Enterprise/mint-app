/***
Section: Add the new enum type
***/

/***
Section: Alter plan_participants_and_providers to use this new type
TODO: Handle historical data!!!
***/

CREATE TYPE FREQUENCY_TYPE_NEW AS ENUM (
  'ANNUALLY',
  'SEMIANUALLY',
  'QUARTERLY',
  'MONTHLY',
  'CONTINUALLY',
  'OTHER'
);

ALTER TABLE plan_participants_and_providers
    ADD COLUMN provider_addition_frequency_continually ZERO_STRING;

/* TODO: HANDLE HISTORICAL DATA */

      -- Alter the provider_addition_frequency column back to an array of the new FREQUENCY_TYPE_NEW enum
ALTER TABLE plan_participants_and_providers
  ALTER COLUMN provider_addition_frequency TYPE FREQUENCY_TYPE_NEW[]
    USING CASE
            WHEN provider_addition_frequency IS NULL THEN ARRAY[]::FREQUENCY_TYPE_NEW[]
            ELSE ARRAY[provider_addition_frequency]::TEXT[]::FREQUENCY_TYPE_NEW[]
    END;
