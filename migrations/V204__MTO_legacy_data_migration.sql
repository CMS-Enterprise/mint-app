/**
This migration migrates operational solution data to mto solution data. It does the following:
1. looks at all operational needs currently set to needed for a model plan. For each operational need, a relevant mto milestone is created.
   a. A matching possible operational need results in a milestone with a matching common milestone
   b. A custom operational need results in a custom mto milestons
2. It then looks at all operational solutions for those operational needs. It will attempt to standardize the mto solutions that are inserted. 
    a. If a solution is duplicated, it will add only one record and link it to both of the new mto milestones
    b. a possible operational solution becomes a common mto solution when possible
    c. a custom operational solution becomes a custom mto solution

3. The following concepts from IT solutions are not applicable in the models to operations matrix.
   a. solution sub tasks
   b. document solution links
**/
