# Capturing who deleted an object in the database

[EASI - 2783](https://jiraent.cms.gov/browse/EASI-2783)

 Auditing who made a change to the application is needed for successful collaboration. With the current auditing paradigm it is possible to record who created or updated a row, by making use of the `created_by` and `modified_by` fields. 

 Deleting a row is more difficult, because the new row is null, so it's not a reliable way to detect who made the change. As such there needs to be another approach to track who has made this change.
## Considered Alternatives

* Use session variables to set who made the change.
* Log into the database under the context of each Okta user
* Do not perform any deletes on data, instead only archive the data

## Decision Outcome

### Chosen Alternative: Use session variables to set who made the change.

 - Session variables allow us to provide some context in the scope of a SQL transaction
 - It is a fairly simple implementation that fulfills the need

- it is important to make sure that the scope of the variable does not extend past the lifecycle of the transaction as it could make for incorrect information.
   - in the [POC test branch](https://github.com/CMSgov/mint-app/tree/EASI-2783/capturing_deleted_actors_spike), this is accomplished by setting the variable to the transaction scope.

- We can have confidence that this approach works correctly by doing unit tests to verify the correct actor is recorded.

## Pros and Cons of the Alternatives

### Log into the database under the context of each Okta user

* `+` You could use built in functions to see who the current user is.
* `-` This doesn't fit the current infrastructure paradigm as the connection is initialized at app start.
* `-` Since there is only one connection to the database at a time, you could potentially store inaccurate actors.


### Do not perform any deletes on data, instead only archive the data

* `+` We can use the existing tested paradigm
* `-` Some situations make more sense to remove the row entry
