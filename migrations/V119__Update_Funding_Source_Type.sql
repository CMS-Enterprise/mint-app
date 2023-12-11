/***
Section: Add the new columns to the database, add the new values to the old type
***/

ALTER TABLE plan_payments
    ADD COLUMN funding_source_medicare_a_info ZERO_STRING,
    ADD COLUMN funding_source_medicare_b_info ZERO_STRING,
    ADD COLUMN funding_source_r_medicare_a_info ZERO_STRING,
    ADD COLUMN funding_source_r_medicare_b_info ZERO_STRING;

ALTER TYPE PP_FUNDING_SOURCE ADD VALUE 'MEDICARE_PART_A_HI_TRUST_FUND';
ALTER TYPE PP_FUNDING_SOURCE ADD VALUE 'MEDICARE_PART_B_SMI_TRUST_FUND';

/***
Section: Update Historic Data
***/

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




/*** 
Section: Rename Type and recreate

***/
ALTER TYPE PP_FUNDING_SOURCE RENAME TO PP_FUNDING_SOURCE_OLD;

CREATE TYPE PP_FUNDING_SOURCE AS ENUM (
  'PATIENT_PROTECTION_AFFORDABLE_CARE_ACT',
  'MEDICARE_PART_A_HI_TRUST_FUND',
  'MEDICARE_PART_B_SMI_TRUST_FUND',
  'OTHER'
);

-- Update funding_source_ column to use the updated type
ALTER TABLE plan_payments
ALTER COLUMN funding_source TYPE PP_FUNDING_SOURCE[]
    using funding_source::text[]::PP_FUNDING_SOURCE[];


-- Update funding_source_r column to use the updated type
ALTER TABLE plan_payments
ALTER COLUMN funding_source_r TYPE PP_FUNDING_SOURCE[]
    using funding_source_r::text[]::PP_FUNDING_SOURCE[];

-- Drop old type
DROP TYPE PP_FUNDING_SOURCE_OLD;

-- Drop old columns
ALTER TABLE plan_payments
    DROP COLUMN funding_source_trust_fund_type,
    DROP COLUMN funding_source_r_trust_fund_type;
