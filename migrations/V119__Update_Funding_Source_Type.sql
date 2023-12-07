-- TODO: SW This should be updated to migrate the data appropriately. This migration right now is meant to unblock front end development only

ALTER TABLE plan_payments
    ADD COLUMN funding_source_medicare_a_info ZERO_STRING,
    ADD COLUMN funding_source_medicare_b_info ZERO_STRING,
    ADD COLUMN funding_source_r_medicare_a_info ZERO_STRING,
    ADD COLUMN funding_source_r_medicare_b_info ZERO_STRING;
    -- DROP COLUMN funding_source_trust_fund_type,
    -- DROP COLUMN funding_source_r_trust_fund_type;


-- TODO add new values to the enum first, don't rename trust fund, just make a new type after this is dropped, which doesn't include trust fund


-- ALTER TYPE PP_FUNDING_SOURCE RENAME VALUE 'TRUST_FUND' TO 'MEDICARE_PART_A_HI_TRUST_FUND'; -- TODO: SW this will need to be renamed more properly later
ALTER TYPE PP_FUNDING_SOURCE ADD VALUE 'MEDICARE_PART_A_HI_TRUST_FUND'; -- TODO: SW this will need to be renamed more properly later
ALTER TYPE PP_FUNDING_SOURCE ADD VALUE 'MEDICARE_PART_B_SMI_TRUST_FUND';

-- WITH Updates AS

/*
Update answer options to:
Patient Protection Affordable Care Act (Sec 3021)
Medicare Part A (HI) Trust Fund + "Additional details" freeform text field
Medicare Part B (SMI) Trust Fund + "Additional details" freeform text field
Other + "Please describe the funding source." freeform text field
 

Historical data
Since previously a user could select "Trust Fund" without selecting either part A or B, in any instances where this has occurred:
Check "Other" and add the text "Trust Fund" to the "Please describe the funding source." freeform text field
*/



-- TODO Drop old values
-- ALTER TABLE plan_payments
--     DROP COLUMN funding_source_trust_fund_type,
--     DROP COLUMN funding_source_r_trust_fund_type;
