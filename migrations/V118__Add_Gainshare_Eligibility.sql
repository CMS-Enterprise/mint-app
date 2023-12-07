CREATE TYPE GAINSHARE_ARRANGEMENT_ELIGIBILITY AS ENUM (
  'ALL_PROVIDERS',
  'SOME_PROVIDERS',
  'OTHER',
  'NO'
  );

ALTER TABLE plan_participants_and_providers
  ADD COLUMN gainshare_payments_eligibility GAINSHARE_ARRANGEMENT_ELIGIBILITY[] DEFAULT NULL,
  ADD COLUMN gainshare_payments_eligibility_other TEXT DEFAULT NULL;
