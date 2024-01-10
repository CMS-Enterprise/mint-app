/***
Section: Add the new enum type
***/

-- create type frequency_type as enum ('ANNUALLY', 'BIANNUALLY', 'QUARTERLY', 'MONTHLY', 'ROLLING', 'OTHER');
-- Change all references from "Biannually" or "Semiannually" to "Semi-annually"
-- Change all references from "Rolling" to "Continually"

ALTER TYPE FREQUENCY_TYPE
RENAME TO FREQUENCY_TYPE_OLD;

ALTER TYPE FREQUENCY_TYPE_OLD ADD VALUE 'SEMIANNUALLY';
ALTER TYPE FREQUENCY_TYPE_OLD ADD VALUE 'CONTINUALLY';

CREATE TYPE FREQUENCY_TYPE AS ENUM (
    'ANNUALLY',
    'SEMIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'CONTINUALLY',
    'OTHER'
);

ALTER TABLE plan_participants_and_providers
ADD COLUMN provider_addition_frequency_continually ZERO_STRING;

-- Change the type of provider_addition_frequency to TEXT for transformation
ALTER TABLE plan_participants_and_providers
ALTER COLUMN provider_addition_frequency TYPE TEXT;

-- Update the data in provider_addition_frequency column
UPDATE plan_participants_and_providers
SET provider_addition_frequency = CASE
    WHEN provider_addition_frequency = 'BIANNUALLY' THEN 'SEMIANNUALLY'
    WHEN provider_addition_frequency = 'ROLLING' THEN 'CONTINUALLY'
    ELSE provider_addition_frequency
END;

-- Alter the provider_addition_frequency column to an array of the new FREQUENCY_TYPE enum
ALTER TABLE plan_participants_and_providers
ALTER COLUMN provider_addition_frequency TYPE FREQUENCY_TYPE[]
USING CASE
    WHEN provider_addition_frequency IS NULL THEN ARRAY[]::FREQUENCY_TYPE[]
    ELSE ARRAY[provider_addition_frequency::FREQUENCY_TYPE]
END;
