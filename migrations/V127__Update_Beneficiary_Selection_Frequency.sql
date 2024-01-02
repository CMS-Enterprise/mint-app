/***
Section: Alter beneficiaries to use this new type
TODO: Handle historical data!!!
***/

ALTER TABLE plan_beneficiaries
    ADD COLUMN beneficiary_selection_frequency_continually ZERO_STRING;

/* TODO: HANDLE HISTORICAL DATA */

      -- Alter the beneficiary_selection_frequency column back to an array of the new FREQUENCY_TYPE_NEW enum
ALTER TABLE plan_beneficiaries
  ALTER COLUMN beneficiary_selection_frequency TYPE FREQUENCY_TYPE_NEW[]
    USING CASE
            WHEN beneficiary_selection_frequency IS NULL THEN ARRAY[]::FREQUENCY_TYPE_NEW[]
            ELSE ARRAY[beneficiary_selection_frequency]::TEXT[]::FREQUENCY_TYPE_NEW[]
    END;
