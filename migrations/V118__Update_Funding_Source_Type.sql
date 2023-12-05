-- TODO: SW This should be updated to migrate the data appropriately. This migration right now is meant to unblock front end development only

ALTER TABLE plan_payments
    ADD COLUMN funding_source_medicare_a_info ZERO_STRING,
    ADD COLUMN funding_source_medicare_b_info ZERO_STRING,
    ADD COLUMN funding_source_r_medicare_a_info ZERO_STRING,
    ADD COLUMN funding_source_r_medicare_b_info ZERO_STRING,
    DROP COLUMN funding_source_trust_fund_type,
    DROP COLUMN funding_source_r_trust_fund_type;



ALTER TYPE PP_FUNDING_SOURCE RENAME VALUE 'TRUST_FUND' TO 'MEDICARE_PART_A_HI_TRUST_FUND'; -- TODO: SW this will need to be renamed more properly later
ALTER TYPE PP_FUNDING_SOURCE ADD VALUE 'MEDICARE_PART_B_SMI_TRUST_FUND';
