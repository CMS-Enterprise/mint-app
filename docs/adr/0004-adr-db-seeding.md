# Database seeding paradigm

[EASI - 2156](https://jiraent.cms.gov/browse/EASI-2156)

MINT has a need to seed data in the database to rapidly develop and test the application. EASi has historically used a Go file to write directly to the database layer to seed data. This required a good deal of maintenance and manual coding.

As an alternative, we have been using a postgres db dump file to quickly seed the data. While simpler, this also introduces some complexity updating the seed file when the database structure is modified in any way.

## Considered Alternatives

* Direct interaction with the database store in Go
* Continue using db dump file, but let migrations update the dump file
* Continue using db dump file, but write a Go program to update the seed file programmatically
* Implement a Go seed program that utilizes the schema resolver methods

## Decision Outcome

* Chosen Alternative: **Implement a Go seed program that utilizes the schema resolver methods**

  * While utilizing resolvers to seed the data takes away some flexibility it is the most easily maintainable. 
  * Business logic is maintained throughout the existing resolvers, so the data easily reflects production data without needing to manually construct it.

  * This will also mean that we aren't able to set explicit ids on the model, as this is handled by the resolvers
    * If there is a need to test data that is not possible from the resolver logic, we can always write a few select methods that call the data layer specifically.
  * We can still have multiple seeding profiles by abstracting the resolver logic, from the specific data
    * For example, the data can be stored in CSV format, and the resolver logic can parse the file, send it to the resolver, and write to the database

  

## Pros and Cons of the Alternatives <!-- optional -->

### Direct interaction with the database store in Go

* `+` Complete flexibility about data going into the database 
* `+` You can purposely seed bad data if desired
* `+` You can set UUID values explicitly
* `-` Requires manual recreation of business logic
* `-` Cumbersome to maintain
* `-` Requires a lot of boilerplate code


### DB Dump files 
* `+` Complete flexibility about data going into the database
* `+` You can purposely seed bad data if desired
* `+` You can set UUID values explicitly
* `-` The seed files are fragile, and break any time you update the schema
* `-` Editing a sql dump file is not straight forward
#### Continue using db dump file, but let migrations update the dump file

* `+` All the above pros
* `+` Additional ability to test database migrations
* `-` Complexity required to implement and maintain this
      
    * Migrations would need to run partially, then seed the data, then migrate again
    * At that point, we'd have to either dump the data again, or continue using the  old version of the seed data
* `-` More manual intervention required


#### Continue using db dump file, but write a Go program to update the seed file programmatically

* `+` All the db dump file pros
* `+` Manual db file manipulation would not be required
* `+` Consistent seed data update approach
* `-` ~ a few days development to develop the Go code
* `-` additional code would need to be maintained
* `-` additional complexity added to update the seed data
