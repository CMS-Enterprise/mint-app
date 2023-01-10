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
        qID.operational_need_id AS operational_need_id,
        pOpSol.id AS solution_type,
        OpSol.needed AS needed,
        pOpSol.sol_name,
        pOpSol.sol_key,
        OpSol.name_other,
        OpSol.poc_name,
        OpSol.poc_email,
        OpSol.must_start_dts,
        OpSol.must_finish_dts,
        COALESCE(OpSol.status, 'NOT_STARTED') AS status,
        COALESCE(OpSol.created_by, 'NULL') AS created_by,
        COALESCE(OpSol.created_dts, CURRENT_TIMESTAMP) AS created_dts,
        OpSol.modified_by,
        OpSol.modified_dts
    FROM QUERIED_IDS AS qID
    INNER JOIN operational_need AS OpNd ON OpNd.id = qID.operational_need_id
    INNER JOIN possible_need_solution_link AS PNSL ON PNSL.need_type = OpNd.need_type
    INNER JOIN possible_operational_solution AS pOpSol ON pOpSol.id = PNSL.solution_type
    LEFT JOIN operational_solution AS OpSol ON OpSol.solution_type = pOpSol.id AND OpSol.operational_need_id = OpNd.id
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
        OpSol.status,
        OpSol.created_by,
        OpSol.created_dts,
        OpSol.modified_by,
        OpSol.modified_dts

    FROM QUERIED_IDS AS qID
    INNER JOIN operational_solution AS OpSol ON OpSol.operational_need_id = qID.operational_need_id
    LEFT JOIN possible_operational_solution AS pOpSol ON OpSol.solution_type = pOpSol.id
    WHERE (qID.include_not_needed = TRUE OR OpSol.needed = TRUE)
    ORDER BY solution_type ASC
),

Translated AS (
    /*Translate the result set to use JSON specific field names */
    SELECT
        res.operational_need_id AS operationalNeedID,
        res.solution_type AS solutionType,
        res.needed AS needed,
        res.sol_name AS name, --noqa
        res.sol_key AS key, --noqa
        res.name_other AS nameOther,
        res.poc_name AS pocName,
        res.poc_email AS pocEmail,
        res.must_start_dts AS mustStartDts,
        res.must_finish_dts AS mustFinishDts,
        res.status AS status,
        res.created_by AS createdBy,
        res.created_dts AS createdDts,
        res.modified_by AS modifiedBy,
        res.modified_dts AS modifiedDts
    FROM resultSet AS res
),

Grouped AS (
    /*Group the result set, and format the result as JSON array */
    SELECT
        qID.res_key,
        JSON_AGG(Translated) AS res --noqa
    FROM QUERIED_IDS AS qID
    LEFT JOIN Translated ON Translated.operationalNeedID = qID.operational_need_id --noqa
    GROUP BY qID.res_key
)


/* Format the Grouped result set as a JSON Map String []*models.OperationalSolution */
SELECT JSONB_OBJECT_AGG(Grouped.res_key, TO_JSONB(GROUPED.res)) --noqa
FROM Grouped;
