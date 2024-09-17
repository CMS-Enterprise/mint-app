# Use Explicit Enum types in GO


[EASI 1982](https://jiraent.cms.gov/browse/EASI-1982)

MINT has a need for storing and representing an array of enums for many form fields. The sql driver that we are using (pq) cannot natively serialize and deserialize a slice of a specific enum type. The approach that has been implemented is to use `pq.StringArray` instead of a slice of the enum type. This requires writing the resolvers for each field that uses `pq.StringArray`, back to the unnamed enum type slice.

Ideally, we would not need to manually write the resolver for GQL, and we could use the same types in GO, and GQL.

## Considered Alternatives

* Explicitly define Enum types
* Use `pq.StringArray` for enum slice needs in GO

## Decision Outcome

### Chosen Alternative: Use `pq.StringArray` for enum slice needs in GO


* Ultimately, it was decided `pq.StringArray` fits our current needs sufficiently.  While defining the types explicitly provides some clarity around expected values in GO, it comes with a great deal of complexity that would need to be supported. At the moment, we don't have any complex business logic in GO that requires us to evaluate the enum slices directly. 
* If a future use case adds business logic that would require evaluation of these slices, then we might consider explicitly defining the types in GO. The branches that implemented these changes will be preserved so we can see a working approach for this in the future. 


## Pros and Cons of the Alternatives <!-- optional -->

### Explicitly define Enum types

* `+` Compile time type safety
   * Note this really only provides safety if you use the constant value that defines the enum value. Otherwise, you could still cast a string to the enum type at compile time.
   * Given that data received by GQL or the backend is necessarily input-driven, this doesn't provide us with any compile-time safety gains anyway.
* `+` Clarity about valid options for a field
* `+` A net negative number of lines of code.
* `-` Extra number of manually coded enum types in the models package
* `-` Extra complexity from needing to implement the Scanner and Valuer interfaces for each array type
* `-` Requires complex methods that would be more appropriate to be supplied by a library than in this repository
* `-` Still requires implementing a GQL resolver to resolve each field that is a typed enum slice.

  *  The POC branch mentioned below explored using custom GQL directives combined with a custom plugin to handle code generation. This was considered a large lift for now.

A [branch](https://github.com/CMS-Enterprise/mint-app/tree/EASI-1982/explicit_enum_types) was made that fully implemented these changes. It revealed the complexity of merging in these changes. (See [`PR-134`](https://github.com/CMS-Enterprise/mint-app/pull/134))

There was also a [proof of concept branch](https://github.com/CMS-Enterprise/mint-app/pull/123) that explored the base work needed to do the above, along with custom GQL directives and plugins to override behavior for binding typed arrays back and forth to GO. (See [`PR-123`](https://github.com/CMS-Enterprise/mint-app/pull/123))
