WITH retVal AS (
    INSERT INTO mto_common_solution_contractor (
        id,
        mto_common_solution_key,
        contractor_title,
        contractor_name,
        created_by,
        created_dts,
        modified_by,
        modified_dts
    ) VALUES (
        :id,
        :mto_common_solution_key,
        :contractor_title,
        :contractor_name,
        :created_by,
        :created_dts,
        :modified_by,
        :modified_dts
    )
    RETURNING *
)
SELECT * FROM retVal;