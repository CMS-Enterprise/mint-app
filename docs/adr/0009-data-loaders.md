# Use Data Loaders for more efficient Data Querying

[EASI - 2572](https://jiraent.cms.gov/browse/EASI-2572)

GraphQL allows users to grab only the information they need at any given time. It does this by making granular requests to the database. As the number of nested objects increase in a request (i.e. `ModelPlan.OperationalNeeds[].OperationalSolutions[].Documents[]`), you potentially have a much larger number of calls to the database than you would have needed previously. 

Data-loaders attempt to solve this by placing a struct on the request level context to optimize the query and return all the data needed for the request. This allows leveraging the strength of GQL, while still making efficient code.

## Considered Alternatives

* Nest Expensive Operations in SQL logic
* Use Data Loaders

## Decision Outcome

* Use Data Loaders

Data Loaders are an efficient, established method of batching data calls that aligns with the GQL philosophy.

* `+` Performant
* `+` Existing well maintained libraries
* `-` Up front complexity to set up
* `-` Complexity if more complicated queries than simple parent key relationship is needed

### Use Cases
1. Anytime that we need to query data by id, and there is the potential for multiple queries to the data base in on request
 
   a . This effectively should be anything that is nested under a parent type.

### Implications

Making Data Loaders standard across the app will be quite feasible. In general, any query that is looking for a collection by a parent will be relatively straightforward to implement.

#### Complications
 * Most data loader libraries assume that each request will only have one key. If you need more parameters for the query, special handling is required.
    * This can be overcome in a few ways. In this initial implementation, the most complex query is `operational_solutions_and_possible_get_by_operational_need_id_LOADER.sql` . As this requires the id and filter parameters multiple places, it made the most sense to send the data to the request as a JSON and deserialize as a table.
    * It should work well to send more complicated requests as a JSON to be parsed as table for any complicated use cases

## Pros and Cons of the Alternatives <!-- optional -->

### Nest Expensive Operations in SQL logic

* `+` Doesn't require another library
* `+` Efficient
* `-` Returns data that might not be needed
* `-` Doesn't align with GQL design practices
