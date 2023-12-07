CREATE TYPE  MODEL_VIEW_FILTER AS ENUM (
  'CCW',
  'CMMI',
  'CBOSC',
  'DFSDM',
  'IPC',
  'IDDOC',
  'MDM',
  'OACT',
  'PBG'
);

ALTER TABLE possible_operational_solution
  ADD COLUMN filter_view MODEL_VIEW_FILTER;


WITH linkViews AS ( --Use a CTE to put the data that needs updating in tabular form
    SELECT 
        '4innovation' AS solution, 
        'INNOVATION'::operational_solution_key AS abbreviation, 
        'IDDOC'::model_view_filter AS link
    UNION ALL
    SELECT 
        'Accountable Care Organization Operating System' AS solution, 
        'ACO_OS'::operational_solution_key AS abbreviation, 
        'IDDOC'::model_view_filter AS link
    UNION ALL
    SELECT 
        'Chronic Conditions Warehouse' AS solution, 
        'CCW'::operational_solution_key AS abbreviation, 
        'CCW'::model_view_filter AS link
    UNION ALL
    SELECT 
        'Consolidated Business Operations Support Center' AS solution, 
        'CBOSC'::operational_solution_key AS abbreviation, 
        'CBOSC'::model_view_filter AS link
    UNION ALL
    SELECT 
        'Innovation Payment Contractor' AS solution, 
        'IPC'::operational_solution_key AS abbreviation, 
        'IPC'::model_view_filter AS link
    UNION ALL
    SELECT 
        'Master Data Management' AS solution, 
        'MDM'::operational_solution_key AS abbreviation, 
        'MDM'::model_view_filter AS link
)

-- Update values matching the CTE to the new provided linkView
UPDATE possible_operational_solution
SET filter_view = linkViews.link
FROM linkViews
WHERE linkViews.abbreviation = possible_operational_solution.sol_key
