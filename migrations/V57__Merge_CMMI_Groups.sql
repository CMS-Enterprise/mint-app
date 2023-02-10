/* You can't drop enum values in GQL. This renames the old type, creates a new type, then updated the data type to the new type */
ALTER TYPE CMMI_GROUP RENAME TO CMMI_GROUP_OLD;


/* Convert to text array for the sake of updating values*/
ALTER TABLE plan_basics
ALTER COLUMN cmmi_groups TYPE TEXT[];

CREATE TYPE CMMI_GROUP AS ENUM (
    'PATIENT_CARE_MODELS_GROUP',
    'POLICY_AND_PROGRAMS_GROUP',
    'SEAMLESS_CARE_MODELS_GROUP',
    'STATE_AND_POPULATION_HEALTH_GROUP',
    'TBD'
);


/* Find basics that had this option selected, update the values to match the new type */
WITH existingBasics AS (
    SELECT
        id,
        cmmi_groups
    FROM plan_basics
    WHERE cmmi_groups && '{"STATE_INNOVATIONS_GROUP","PREVENTIVE_AND_POPULATION_HEALTH_CARE_MODELS_GROUP"}' --either of these groups selected as options
),

modifiedBasics AS (
    SELECT
        id,
        array_append(
            array_remove(
                array_remove(cmmi_groups, 'STATE_INNOVATIONS_GROUP'), --Remove both element one at a time (if it exists in instance)
                'PREVENTIVE_AND_POPULATION_HEALTH_CARE_MODELS_GROUP'),
            'STATE_AND_POPULATION_HEALTH_GROUP') AS cmmi_groupsUpdate --Add the new type where either were present

    FROM existingBasics
)

UPDATE plan_basics
SET cmmi_groups = modifiedBasics.cmmi_groupsUpdate,
    modified_by = '00000001-0001-0001-0001-000000000001', --SYSTEM account
    modified_dts = current_timestamp
FROM modifiedBasics
WHERE plan_basics.id = modifiedBasics.id;


/* Update the type on the column to be the new type, and provide a casting mechanism to convert to the new type */
ALTER TABLE plan_basics
ALTER COLUMN cmmi_groups TYPE CMMI_GROUP[]
USING (cmmi_groups::CMMI_GROUP[]);

/* Drop the old type */
DROP TYPE CMMI_GROUP_OLD;
