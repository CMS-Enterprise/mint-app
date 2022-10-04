# Data Exporting Approach

[EASI - 2061](https://jiraent.cms.gov/browse/EASI-2061)

MINT has a need to support the exporting of data from the application for reporting and other use cases.

EASi currently has an export feature but it is a simplistic/not ideal approach that outputs all fields in the database into one huge CSV. The MINT team and stakeholders want to consider different approaches to exporting data rather then just re-implementing the existing feature from EASi.

## Considered Alternatives
* Use GraphQL to query model data and format/export data in the frontend
* Export `models` directly
* Manually convert custom SQL query results (current EASi solution)

## Decision Outcome
* Chosen solution: Use GraphQL to query model data and format/export data in the frontend

## Pros and Cons of Chosen Solution
* `+` Fills need of initial MVP (dump all data into a CSV) without added complexity and LOE
* `+` Removes need for backend work entirely (at least for MVP)
* `+` Team has experience implementing similar features using frontend libraries
* `-` Requires a "one off"/specialized GraphQL query in order to fetch all of the data. This will need to be continually updated every time a new query/field is added or modified
* `-` Formatting and data transformation options are not as robust if we wanted to expand this functionality in the future

## Follow Up Decisions and Actions
* What are some potential future use cases for exporting in MINT?
  * Individual models, all models, other ancillary data?
  * Export a hard coded set of fields or allow users to specify what they want?
* What format do we use for exporting?
  * Excel
    * Excelize GoLang library
      * https://github.com/qax-os/excelize
      * https://pkg.go.dev/github.com/360entsecgroup-skylar/excelize
      * This may be slightly overkill for MINTs current needs
  * Raw CSV
* There are potential performance concerns if we try to export a lot of data at once, we should look into approaches to help maximize performance
  * The use of [dataloaders](https://gqlgen.com/reference/dataloaders/) might be a good solution to explore

* Can we abstract out this functionality so that it can be reused across MINT and EASi?
  * This may be a good candidate for the new easi-shared repository

## Pros and Cons of the Alternatives

### Export `models` directly
* `+` We can re-use existing `store` methods
* `+` Adding additional data to export should be trivial
* `-` Coupling data export to internal storage which may have different requirements and/or use cases
* `-` Translation logic will need to be kept up-to-date with data types in order to fully support all types of data, and this logic wont be obviously tied to the internal models
### Manually convert custom SQL query results
* `+` This is the approach taken in EASi
* `+` Most likely lower initial LOE
* `-` Current EASi implementation is not ideal
* `-` Not super extensible w/o significant future effort
