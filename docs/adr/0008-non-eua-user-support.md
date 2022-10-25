# Support non-EUA users 

[EASI - 2260](https://jiraent.cms.gov/browse/EASI-2260)

Future use of the MINT application will extend to users who do not have an EUAID, specifically MAC (Medicare Administrative Contractor) users. Currently, the database uses the EUAID to distinguish a user for most tables.  Without an EUAID, a user is not currently able to modify data.

The first iteration need of a MAC user is just authentication. This would still fit with our database paradigm, as there is no need to write information.

In the future, MAC users might contribute to discussions, but there are no plans for allowing non-eua users to modify any other data, or collaborate on a model. Currently there is no distinction between an EUA user and a non EUA user. The IDM team advised that they could add a `is-eua: true` to the team if needed.


*[decision drivers | forces]* <!-- optional -->
Priority is given to the solution that gives us flexibility for anticipated future needs, as well as remaining as simple as possible.

## Considered Alternatives

* User Table
* Conditional Secondary ID when needed

## Decision Outcome

* Chosen Alternative: User Table
 After much discussion with the team, we have decided to implement a user table. This table is an investment in the future state of the application. Although not mandatory for the first implementation of MAC user support, it will allow greater flexibility for the experience provided to the entire user base.

## Pros and Cons of the Alternatives <!-- optional -->

### User Table

* `+` Having a secondary user table allows us to store more additional data associated to a user.
* `+` This decouples the idea of a user from an EUAID. A user can be represented even if they have login information that differs from the traditional EUAID.
* `+` This allows future growth and flexibility. We can cache user information and store it directly in the database
* `-` The current database tables rely on an EUAID, and would need to be re-factored to use this paradigm.
* `-` Different validation would need to be implemented to verify that the user has a record in MINT outside of IDM managed permissions.

### Conditional Secondary ID when needed
* `+` This solution fits all future and current use needs, without complicating the current architecture.
* `-` If more interactions for with the system for non - eau users are identified in the future, we'd need to revisit this and potentially refactor to a more complex solution.
