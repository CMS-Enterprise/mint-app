ALTER TYPE CMS_CENTER RENAME TO CMS_CENTER_OLD; --rename existing type


CREATE TYPE CMS_CENTER AS ENUM ( --create new type without 'OTHER' as option
  'CMMI',
  'CENTER_FOR_MEDICARE',
  'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE',
  'CENTER_FOR_MEDICAID_AND_CHIP_SERVICES',
  'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY',
  'CENTER_FOR_PROGRAM_INTEGRITY'
);


UPDATE plan_basics SET cms_centers = array_remove(cms_centers, 'OTHER') -- remove any selection of other for cms_centers field
WHERE 'OTHER' = ANY (cms_centers);

ALTER TABLE plan_basics
    ALTER COLUMN cms_centers TYPE CMS_CENTER[] -- update the type to the new type which doesn't include other
        using cms_centers::text[]::CMS_CENTER[];

DROP TYPE CMS_CENTER_OLD;


ALTER TABLE plan_basics DROP COLUMN "cms_other"; -- remove other column
