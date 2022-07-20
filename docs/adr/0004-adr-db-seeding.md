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

### *[alternative 1]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### *[alternative 2]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### *[alternative 3]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->
