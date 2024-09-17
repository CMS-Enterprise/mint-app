# Utilization of temporal tables

## Background

Temporal tables are database tables that keep track of changes to data over time. They are commonly used in Microsoft SQL Server to maintain an audit trail of data changes. While PostgreSQL does not have native support for temporal tables, the same behavior can be replicated by using triggers to capture changes and store historical data in separate tables. As compared to a generic implementation, a temporal table utilizes a typed record that shows the state of a row at any given instant in time, instead of just saying what was changed.

### Postgres implementation
As a starting point this [repositories](https://github.com/nearform/temporal_tables/blob/master/package.json) trigger was used.

This implementation works fairly well, but does have some features that could be changed to have a more specific implementation for our needs.

It works by creating a history table that corresponds to every record that is desired to be audited. The versioning trigger is a called before the update of a row, and it inserts the values of the row into the table. It has a date range column that it updates to show for what time period the record was the listed value. With this implementation, the most up to date record is always the record that is in the main table, not the history table.

The trigger also has functionality to only create a record if the data was actually changed. In practice, this doesn't work for our implementation as meta data columns like `modified_by` and `modified_dts` can be changed without changing any other actual data. This effectively results in multiple empty historic entries. 


### Handling data migrations
The solution natively handles data changes in a variety of ways.
#### Column Addition
    1. If a column is added to the main table, and not to the history table,that column is not audited.
    2. If the column should be audited, it must be added to the history table as well as the main table.


#### Column Removal
    1. If a column is removed from the main table and not the history table, you will retain all of the historic data.
    2. You can also remove the column from both the main and the historic table, but you will loose all historic data in that column.

#### Enum Changes
    1. If an enum has a value added, the history table can also accept the value as an entry.
    2. If an enum has a value removed (By altering types, and the type being used by the table), you currently would have to remove the historic entries of that value. As such it might be preferable to not remove it from the database, but limit the ability to select that option in App Code
        a. Other attempts were made to have two separate types, one with historic values ( all past values, and all new current ones)
           i. This didn't work, as the trigger currently requires the data to be the same type in the main table and the historic table
           ii. Similarly, this didn't work when trying to insert an enum value in the main table to a string value in the history table as the types were changed.
    

### POC Branch

As part of exploration of the use of temporal tables, [a POC branch was made here](https://github.com/CMS-Enterprise/mint-app/tree/EASI-2900/temporal_tables_poc).

A [utility](https://github.com/CMS-Enterprise/mint-app/tree/EASI-2900/temporal_tables_poc/cmd/temporalSimulator) was created to explore how the database would handle migrations. 

To explore the functionality, you can build it like this ` go build -a -o bin/tSim ./cmd/temporalSimulator    `

Once built, you can bring up the application, seed the data and experiment with running various scenarios for modifying the database structure. For example, you can add a new column to `model_plan` and `model_plan_history` by calling `tsim addCol `

This branch also has a couple different versions of the trigger to highlight some different possible implementations.

### Possible Implementation Changes
1. Update the trigger to use a configuration like exists in `audit.table_config` currently to specify additional columns to ignore. ([implemented here](https://github.com/CMS-Enterprise/mint-app/blob/EASI-2900/temporal_tables_poc/migrations/V96__Temporal_Tables_Modified.sql))
2. Update the trigger to be run after an update instead of before. Insert the current up to date value in the table, with an indefinite time range.
    
    a. This would have the benefit of only needing to search the one table to get the entire view of an object in just one table instead of needing to query the main table and the history table. (This also introduces complexity, so it's benefit needs to be weighed)
3. Combine the audit paradigms. Temporal tables provide us a moment in time snapshot. The audit change table current provides the benefit of clearly showing who made a change, and when.

    a. The temporal table trigger can be expanded to also insert the changes column with the rest of the data. Then we have the changes stored without needing to calculate deltas at run time. This would also make searching simpler.
