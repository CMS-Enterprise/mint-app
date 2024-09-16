# Persistence Layer Planning

[EASI - 1700](https://jiraent.cms.gov/browse/EASI-1700)

As we begin to develop MINT as a new application based on EASi, we need to evaluate the persistence layer needs.

## Questions this Spike Should Answer
1. What kind of persistence layer makes sense for the CMMI work?
    * a. Relational Database?
    * b. Document Store / NoSQL?
2.  What kinds of data are we going to be storing? 
3. Is there value in stored procedures over inline SQL for a relational database?
4. Do we need anything else on top of a relational data store?
5. Are there any areas that caching solutions might be helpful?

## 1.  Relational vs Non-Relational

### Research
#### Relational (Postgres)
* `+` Highly Structured
* `+` Existing EASI groundwork
  * `+` Flyway
  * `+` Existing Data Structures

* `-` Can require some more upfront work

 #### Non-Relational (Mongo-DB)
*  `+` Flexible
*  `+` Document Store seems to fit the form paradigm, and allows for future changes
* `-` Does not take advantage of existing EASi framework
* `-` Requires implementing new frameworks
* `-` Mongo-DB is not FedRAMP approved
  * if  desired we could use DynamoDB, which is FedRAMP approved

### Decision Outcome
* Chosen Alternative: Relational Database
   * This will leverage the architecture that is already in use in EASi
   * It will be simpler for developers to work on both projects


## 2.  What kinds of data are we going to be storing? 

### Research
* Form data
  * Yes, No, TBD answer
* Question and Answers
* Supporting Documentation
  * variety of file types
* Potentially audit trail


 ## 3. Is there value in stored procedures over inline SQL for a relational database?

The existing EASi paradigm uses [sqlx](https://github.com/CMS-Enterprise/easi-app/blob/master/docs/adr/0017-go-orm.md) fo Go Database access. It currently uses this in combination with inline sql to access the database.
 ### Research
 #### Stored Procedures

* `+` Reusable
* `+` Optimized
* `-` DB driver support is limited
* `-` Doesn't work well with

#### Inline SQL with SQLX

* `+` Existing paradigm that is used in EASi 
* `-` Does not take advantage of VSCode SQL editing features

 #### Separate SQL files in code base
 * `+` Reusable
 * `+` Performance improvements by preparing the statements
 * `+` Use existing db driver SQLX

### Decision Outcome
* Chosen Alternative: Separate SQL files in code base
   * This will leverage the architecture that is already in use in 
   * It will create reusable code




## 4. Do we need anything else on top of a relational data store?

 ### Research
  
  Current needs seem to be fulfilled simply with a relational data store. However, if we do end up needing a caching solution in the future, [Redis](https://redis.io/) would be a nice solution. See [question number 5](##5.-Are-there-any-areas-that-caching-solutions-might-be-helpful?)


## 5. Are there any areas that caching solutions might be helpful?  
For initial needs, we likely won't need any caching. However there are a few potential scenarios that could take advantage of caching. 
* Concurrent Editing
  * Sockets
* Slow API responses
