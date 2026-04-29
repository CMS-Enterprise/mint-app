WITH parent_categories AS (
    SELECT
        tc.id,
        tc.name
    FROM mto_template_category tc
    WHERE
        tc.parent_id IS NULL
        AND tc.name <> ''
)

SELECT
    parent.name,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT child.name ORDER BY child.name), NULL) AS sub_categories
FROM parent_categories parent
LEFT JOIN mto_template_category child
    ON
        child.parent_id = parent.id
        AND child.name <> ''
GROUP BY parent.name
ORDER BY parent.name;
