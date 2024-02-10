/***
Section: Add the new columns to the database, add the new values to the old type
***/

ALTER TABLE plan_payments
    ADD COLUMN funding_source_medicare_a_info ZERO_STRING,
    ADD COLUMN funding_source_medicare_b_info ZERO_STRING,
    ADD COLUMN funding_source_r_medicare_a_info ZERO_STRING,
    ADD COLUMN funding_source_r_medicare_b_info ZERO_STRING;

ALTER TABLE plan_payments  
  ALTER COLUMN funding_source TYPE TEXT[],  
  ALTER COLUMN funding_source_r TYPE TEXT[];  

-- We will add these new values later, not needed now because the columns take text
-- ALTER TYPE PP_FUNDING_SOURCE ADD VALUE 'MEDICARE_PART_A_HI_TRUST_FUND';
-- ALTER TYPE PP_FUNDING_SOURCE ADD VALUE 'MEDICARE_PART_B_SMI_TRUST_FUND';

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
-- SELECT all data that had TRUST_FUND selected for funding_source or funding_source_r
WITH paymentsToUpdate AS ( 
	SELECT id,
	funding_source,
	funding_source_trust_fund_type,
	funding_source_other,
	funding_source_r,
	funding_source_r_trust_fund_type,
	funding_source_r_other
	FROM plan_payments
		WHERE plan_payments.funding_source @> '{"TRUST_FUND"}' OR plan_payments.funding_source_r @> '{"TRUST_FUND"}'	
	),
-- start updating data, select situations where only TRUST_FUND is selected. Also note if either funding source option was selected in their own columns
paymentCalcs AS (
	SELECT 
	id,
	 array_remove(funding_source,'TRUST_FUND') AS funding_source_update,
	 funding_source,
	funding_source_trust_fund_type,
	CASE WHEN
	 ((funding_source_trust_fund_type IS NULL OR funding_source_trust_fund_type = '{}') AND funding_source @> '{"TRUST_FUND"}' )
	THEN 'OTHER'
	ELSE NULL
	END	AS trust_fund_not_selected, -- no trust fund selected, and funding source said trust fund
	 funding_source_trust_fund_type AS funding_source_trust_fund_type_update, 
	-- Set fields to include the new values if they were selected as a trust fund type
	 CASE WHEN funding_source_trust_fund_type @> '{"MEDICARE_PART_A_HI_TRUST_FUND"}' THEN 'MEDICARE_PART_A_HI_TRUST_FUND'
		ELSE NULL
		END AS funding_source_trust_fund_medicare_a,
	 CASE WHEN funding_source_trust_fund_type @> '{"MEDICARE_PART_B_SMI_TRUST_FUND"}' THEN 'MEDICARE_PART_B_SMI_TRUST_FUND'
		ELSE NULL
		END AS funding_source_trust_fund_medicare_b, 
	 array_remove(funding_source_r,'TRUST_FUND') AS funding_source_r_update,
	 funding_source_r,
	 funding_source_r_trust_fund_type,
	CASE WHEN
	 ((funding_source_r_trust_fund_type IS NULL OR funding_source_r_trust_fund_type = '{}') AND funding_source_r @> '{"TRUST_FUND"}') 
	THEN 'OTHER'
	ELSE NULL
	END AS trust_fund_r_not_selected, -- no trust fund selected, and funding source r said trust fund
	-- Set fields to include the new values if they were selected as a trust fund type
	 CASE WHEN funding_source_r_trust_fund_type @> '{"MEDICARE_PART_A_HI_TRUST_FUND"}' THEN 'MEDICARE_PART_A_HI_TRUST_FUND'
		ELSE NULL
		END AS funding_source_r_trust_fund_medicare_a,
	 CASE WHEN funding_source_r_trust_fund_type @> '{"MEDICARE_PART_B_SMI_TRUST_FUND"}' THEN 'MEDICARE_PART_B_SMI_TRUST_FUND'
		ELSE NULL
		END AS funding_source_r_trust_fund_medicare_b,
		funding_source_other,
		funding_source_r_other
	 
	FROM paymentsToUpdate
	),
	
	finalData AS (
	SELECT 
	id,
	funding_source,
	-- form an array of the new medicare options if they were selected, and remove any nulls, and combine with the funding source minus TRUST FUND
	-- SELECT Distinct ensures there are no duplicate entries
	ARRAY(SELECT DISTINCT unnest( array_cat(funding_source_update, array_remove(ARRAY[ 
			funding_source_trust_fund_medicare_a,
		funding_source_trust_fund_medicare_b,
		trust_fund_not_selected],NULL)))) --trust_fund_not_selected denotes if "OTHER" should be added
	as funding_source_update_final,
	funding_source_trust_fund_type,

	-- Update other to append trust fund if needed
	CASE WHEN trust_fund_not_selected = 'OTHER' THEN CONCAT(funding_source_other, ' : Trust Fund')
		ELSE funding_source_other
	END
	AS funding_source_other_update,


	-- form an array of the new medicare options if they were selected, and remove any nulls, and combine with the funding source minus TRUST FUND.
	-- SELECT Distinct ensures there are no duplicate entries
	ARRAY(SELECT DISTINCT unnest(array_cat(funding_source_r_update, array_remove(ARRAY[ 
			funding_source_r_trust_fund_medicare_a,
		funding_source_r_trust_fund_medicare_b,
	trust_fund_r_not_selected],NULL))))
	as funding_source_r_update_final,

		funding_source_r_trust_fund_type,
	-- Update other to append trust fund if needed
	CASE WHEN trust_fund_r_not_selected = 'OTHER' THEN CONCAT(funding_source_r_other, ' : Trust Fund')
		ELSE funding_source_r_other
	END
	AS funding_source_r_other_update

	FROM paymentCalcs
		ORDER BY id
	)
		
		
-- SELECT * FROM finalData

UPDATE plan_payments
SET
funding_source = funding_source_update_final,
funding_source_other= funding_source_other_update,
funding_source_r = funding_source_r_update_final,
funding_source_r_other = funding_source_r_other_update,
modified_by = '00000001-0001-0001-0001-000000000001', --System Account
modified_dts = current_timestamp
FROM finalData
WHERE finalData.id = plan_payments.id;




/*** 
Section: Rename Type and recreate

***/

-- Drop old type
DROP TYPE PP_FUNDING_SOURCE;

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


-- Drop old columns
ALTER TABLE plan_payments
    DROP COLUMN funding_source_trust_fund_type,
    DROP COLUMN funding_source_r_trust_fund_type;
