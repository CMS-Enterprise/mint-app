
/***
Section: Add the new enum type
***/

CREATE TYPE FREQUENCY_TYPE_NEW AS ENUM (
  'ANNUALLY',
  'SEMIANUALLY',
  'QUARTERLY',
  'MONTHLY',
  'CONTINUALLY',
  'OTHER'
);

/***
Section: Alter plan_payments to use this new type
TODO: Handle historical data!!!
***/

ALTER TABLE plan_payments
    ADD COLUMN anticipated_payment_frequency_continually ZERO_STRING;

/* TODO: HANDLE HISTORICAL DATA */

ALTER TABLE plan_payments
	ALTER COLUMN anticipated_payment_frequency TYPE FREQUENCY_TYPE_NEW[] USING anticipated_payment_frequency::TEXT[]::FREQUENCY_TYPE_NEW[];
