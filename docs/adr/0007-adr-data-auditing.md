# Data Auditing

MINT facilitates multi-user collaboration. As such, it's important to track who is making changes to data, what is being changed, and when the data is being changed. Users will use this information to get a digest of what has changed on models they have favorited in a given time period. This information could potentially be used in the future to correct incorrect information changed by another user.


## Considered Alternatives

* Generic Auditing Triggers in the Database
* Full Records of Every Change
* Partial Version history and current version
* Store object Delta history, apply changes to show current version

## Decision Outcome

* Chosen Alternative: Generic Auditing Triggers

   * A Generic Audit Trigger creates a standard paradigm for storing data changes works with our current implementation. 
   * While the initial implemenation might be a bit complex, using the data is fairly straightforward.
   * Once configured additional tables will be able to use the existing trigger, without the need for additional data. 



## Pros and Cons of the Alternatives <!-- optional -->

### Generic Auditing Triggers in the Database

* `+` Re-usable
* `+` Well used approach
* `+` Only Changes are stored
* `+` All changes are captured, no matter if they come from the API or SQL.
* `+` Existing queries work with this set up
* `-` Initial Complexity to set up

### Full Records of Every Change

* `-` Increased database size
* `-` A new audit table is required for every data row

### Partial Version history and current version

* `+` Similar to our current approach
* `-` Increased database size
* `-` Increased table complexity

### Store object Delta history, apply changes to show current version

* `+` DataBase size is smaller than some options
* `-` Additional complexity querying up to date models.
* *[...]* <!-- numbers of pros and cons can vary -->
