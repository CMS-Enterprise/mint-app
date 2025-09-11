UPDATE mto_common_solution
SET
    name = CASE key
        WHEN 'T_MISS' THEN 'Transformed Medicaid Statistical Information System (T-MSIS)'
        WHEN 'IC_LANDING' THEN 'Innovation Center Landing Page (IC Landing)'
        ELSE name
    END
WHERE key IN ('T_MISS' , 'IC_LANDING');
