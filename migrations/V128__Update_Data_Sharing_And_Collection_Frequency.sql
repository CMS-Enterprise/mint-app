/***
Section: Alter plan_ops_eval_and_learning to use this new type
TODO: Handle historical data!!!
***/

ALTER TABLE plan_ops_eval_and_learning
    ADD COLUMN data_collection_frequency_continually ZERO_STRING,
    ADD COLUMN data_sharing_frequency_continually ZERO_STRING;

/* TODO: HANDLE HISTORICAL DATA */

ALTER TABLE plan_ops_eval_and_learning
	ALTER COLUMN data_collection_frequency TYPE FREQUENCY_TYPE_NEW[] USING data_collection_frequency::TEXT[]::FREQUENCY_TYPE_NEW[],
    ALTER COLUMN data_sharing_frequency TYPE FREQUENCY_TYPE_NEW[] USING data_sharing_frequency::TEXT[]::FREQUENCY_TYPE_NEW[];
