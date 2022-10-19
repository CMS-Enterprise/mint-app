# Support non-EUA users 

[EASI - 2260](https://jiraent.cms.gov/browse/EASI-2260)

Future use of the MINT application will extend to users who do not have an EUAID, specifically MAC (Medicare Administrative Contractor) users. Currently, the database uses the EUAID to distinguish a user for most tables.  Without an EUAID, a user is not currently able to modify data.

The first iteration need of a MAC user is just authentication. This would still fit with our database paradigm, as there is no need to write information.

In the future, MAC users might contribute to discussions, but there are no plans for allowing non-eua users to modify any other data, or collaborate on a model.


*[decision drivers | forces]* <!-- optional -->
Priority is given to the solution that gives us flexibility for anticipated future needs, as well as remaining as simple as possible.

## Considered Alternatives

* User Table
* Conditional Secondary ID when needed

## Decision Outcome

* Chosen Alternative: Conditional Secondary ID when needed
* This solution fits all future and current use needs, without complicating the current architecture.
* *[consequences. e.g.,
  negative impact on quality attribute,
  follow-up decisions required,
  ...]* <!-- optional -->

## Pros and Cons of the Alternatives <!-- optional -->

### User Table

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
