WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT
        include_not_needed,
        operational_need_id,
        CAST(operational_need_id AS TEXT) || CAST(include_not_needed AS TEXT) AS res_key
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("operational_need_id" UUID, "include_not_needed" BOOLEAN ) --noqa
),

possibleSolution AS (
    /*Get the mapped possible solutions for given operational need */
    SELECT
        OpSol.id,
        qID.operational_need_id,
        pOpSol.id AS solution_type,
        OpSol.needed,
        pOpSol.sol_name,
        pOpSol.sol_key,
        OpSol.name_other,
        OpSol.poc_name,
        OpSol.poc_email,
        OpSol.must_start_dts,
        OpSol.must_finish_dts,
        COALESCE(OpSol.is_other, pOpSol.treat_as_other) AS is_other,
        OpSol.other_header,
        COALESCE(OpSol.status, 'NOT_STARTED') AS status,
        COALESCE(OpSol.created_by, '00000000-0000-0000-0000-000000000000') AS created_by, -- This is UUID.NIL, the same as the UNKNOWN_USER account in the DB
        COALESCE(OpSol.created_dts, CURRENT_TIMESTAMP) AS created_dts,
        OpSol.modified_by,
        OpSol.modified_dts,
        TRUE AS is_common_solution -- Linked Possible Solutions are always a common solution
    FROM QUERIED_IDS AS qID
    INNER JOIN operational_need AS OpNd ON qID.operational_need_id = OpNd.id
    INNER JOIN possible_need_solution_link AS PNSL ON OpNd.need_type = PNSL.need_type
    INNER JOIN possible_operational_solution AS pOpSol ON PNSL.solution_type = pOpSol.id
    LEFT JOIN operational_solution AS OpSol ON pOpSol.id = OpSol.solution_type AND OpNd.id = OpSol.operational_need_id
    WHERE (qID.include_not_needed = TRUE OR OpSol.needed = TRUE)
),

resultSet AS (
    /*Get the possible solutions and the actual solutions for given operational need */
    SELECT * FROM possibleSolution

    UNION
    SELECT
        OpSol.id,
        OpSol.operational_need_id,
        OpSol.solution_type,
        OpSol.needed,
        pOpSol.sol_name,
        pOpSol.sol_key,
        OpSol.name_other,
        OpSol.poc_name,
        OpSol.poc_email,
        OpSol.must_start_dts,
        OpSol.must_finish_dts,
        OpSol.is_other,
        OpSol.other_header,
        OpSol.status,
        OpSol.created_by,
        OpSol.created_dts,
        OpSol.modified_by,
        OpSol.modified_dts,
        PNSL.id IS NOT NULL AS is_common_solution -- A Common Solution is a solution that is linked as a possible solution for an operational need

    FROM QUERIED_IDS AS qID
    INNER JOIN operational_solution AS OpSol ON qID.operational_need_id = OpSol.operational_need_id
    LEFT JOIN possible_operational_solution AS pOpSol ON OpSol.solution_type = pOpSol.id
    LEFT JOIN operational_need ON OpSol.operational_need_id = operational_need.id
    LEFT JOIN possible_need_solution_link AS PNSL ON pOpSol.id = PNSL.solution_type AND operational_need.need_type = PNSL.need_type
    WHERE (qID.include_not_needed = TRUE OR OpSol.needed = TRUE)
    ORDER BY solution_type ASC
)

SELECT *
FROM resultSet;
