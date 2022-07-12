# Use Explicit Enum types in GO


[EASI-1982](https://jiraent.cms.gov/browse/EASI-1982)

MINT has a need for storing and representing an array of enums for many form fields. The sql driver that we are using (pq) cannot natively serialize and unserialize a slice or a specific enum type. The approach that has been implemented is to use pq.StringArray instead of a slice of the enum type. This requires writing the resolvers for each field that uses pq.StringArray, back to the unnamed enum type slice.

Ideally, we would not need to manually write the resolver for GQL, and we could use the same types in GO, and GQL.

## Considered Alternatives

* Explicitly define Enum types
* Use pq.StringArray for enum slice needs in GO

## Decision Outcome

* Chosen Alternative: Use pq.StringArray for enum slice needs in GO
* *[justification.
  e.g., only alternative,
  which meets KO criterion decision driver
  | which resolves force force
  | ...
  | comes out best (see below)]*
* *[consequences. e.g.,
  negative impact on quality attribute,
  follow-up decisions required,
  ...]* <!-- optional -->

## Pros and Cons of the Alternatives <!-- optional -->

### Explicitly define Enum types

* `+` Compile time type safety
* `+` Clarity about valid options for a field
* `-` Extra number of manually coded enum types in the models pacakge
* `-` Extra complexity from needing to implement the Scanner and Valuer interfaces for each array type

A [branch](https://github.com/CMSgov/mint-app/tree/EASI-1982/explicit_enum_types) was made that fully implemented these changes. It revealed teh complexity of merging in these changes. (See [PR-134](https://github.com/CMSgov/mint-app/pull/134))

There was also a [proof of concept branch](https://github.com/CMSgov/mint-app/pull/123) that explored the base work needed to do the above, along with custom GQL directives and plugins to override behavior for binding typed arrays back and forth to GO. (See [PR-123](https://github.com/CMSgov/mint-app/pull/123))
