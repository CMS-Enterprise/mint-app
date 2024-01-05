/***
Section: Alter plan_ops_eval_and_learning to use this new type
TODO: Handle historical data!!!
***/
ALTER TYPE DATA_FREQUENCY_TYPE RENAME TO DATA_FREQUENCY_TYPE_OLD;

CREATE TYPE DATA_FREQUENCY_TYPE AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
  'continually'
);


ALTER TABLE plan_ops_eval_and_learning
  ALTER

ALTER TABLE plan_ops_eval_and_learning
    ADD COLUMN data_collection_frequency_continually ZERO_STRING,
    ADD COLUMN data_sharing_frequency_continually ZERO_STRING;

/* TODO: HANDLE HISTORICAL DATA */

ALTER TABLE plan_ops_eval_and_learning
	ALTER COLUMN data_collection_frequency TYPE FREQUENCY_TYPE_NEW[] USING data_collection_frequency::TEXT[]::FREQUENCY_TYPE_NEW[],
    ALTER COLUMN data_sharing_frequency TYPE FREQUENCY_TYPE_NEW[] USING data_sharing_frequency::TEXT[]::FREQUENCY_TYPE_NEW[];
