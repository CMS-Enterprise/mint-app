BEGIN;
  ALTER TABLE plan_payments
    DROP COLUMN funding_structure;

  CREATE TYPE trust_fund_type AS ENUM (
      'MEDICARE_PART_A_HI_TRUST_FUND',
      'MEDICARE_PART_B_SMI_TRUST_FUND'
    );

  ALTER TABLE public.plan_payments
    ADD COLUMN funding_source_trust_fund_type trust_fund_type DEFAULT NULL,
    ADD COLUMN funding_source_r_trust_fund_type trust_fund_type DEFAULT NULL;
END;
