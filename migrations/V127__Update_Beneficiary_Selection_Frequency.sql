/***
Section: Alter beneficiaries to use this new type
TODO: Handle historical data!!!
***/

ALTER TABLE plan_beneficiaries
    ADD COLUMN beneficiary_selection_frequency_continually ZERO_STRING;

/* TODO: HANDLE HISTORICAL DATA */

ALTER TABLE plan_beneficiaries
	ALTER COLUMN beneficiary_selection_frequency TYPE FREQUENCY_TYPE_NEW[] USING beneficiary_selection_frequency::TEXT[]::FREQUENCY_TYPE_NEW[];
