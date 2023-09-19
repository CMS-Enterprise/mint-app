# Implementing Tagged Content


[EASI - 3130](https://jiraent.cms.gov/browse/EASI-3130)

There is a new need to be able to tag multiple entities in string content, currently either a user, or a possible operational solution. This involves a few different engineering challenges to address. 

On the backend:
1. How to store an index able record of a tag.
2. How to store different entity types generically in the database.
3. How to dynamically retrieve different tagged entity in GraphQL.
4. How to parse tag content that is embedded in a string.


On the frontend
1. How to render tagged content in inputs.
2. How to utilize a library to handle tagging for our purposes.
3. How to override tag defaults to provide needed information to store tags on the backend.

To research these issues, a [POC branch](https://github.com/CMSgov/mint-app/tree/EASI-3130/discussion_tagging_spike_poc) was created, and made into a [Draft PR](https://github.com/CMSgov/mint-app/pull/702)

## Backend Discoveries
The backend explored two options for parsing or storing tagged strings, either a. parse the content and store directly or b. require raw content as well as a second input for tagged content information. Option b opens up data integrity issues, as the tags could potentially not match the raw content. As such, we selected option a. It can be accomplished by using regex capture groups to parse and validate the tags.

To handle the need to store different entity types in the database, we explored the idea of a tag type. This type is used when parsing the data structure to programmatically populate the tag based on required data. (For example, a user account has an id of type UUID, and a possible solution has an if of type int.)

On the database side, there is a balance between flexibility, and index ability. To allow completely relational tags, you need to map a foreign key relationship. With data that maps to multiple different types, you can't use the same column as a foreign key relationship to different tables. To allow for greater flexibility, we implemented a generic tag table. This table maps the type of tag, the source table, the source table field, and the source table primary key. This allows future flexibility to add tags to other columns and tables. This still allows for joining, and dynamic retrieval of data. If desired, we can split this into more granular tables in the future without causing issues.

As a tag can represent different entities, we needed a way to dynamically return different result types in the same field. GraphQL has the concept of a union type which allows this. To support this on the backend, you need to define an interface that has the same name as the union type, and implement it on the GO types you would like to return. With the data in the tag, we can dynamically return either a user account or possible operational solution.

## Considered Options

* *[option 1]*
* *[option 2]*
* *[option 3]*
* *[...]* <!-- numbers of options can vary -->

## Decision Outcome

* Chosen Option: *[option 1]*
* *[justification.
  e.g., only option,
  which meets KO criterion decision driver
  | which resolves force force
  | ...
  | comes out best (see below)]*
* *[consequences. e.g.,
  negative impact on quality attribute,
  follow-up decisions required,
  ...]* <!-- optional -->

## Pros and Cons of the Options <!-- optional -->

### *[option 1]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### *[option 2]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->

### *[option 3]*

* `+` *[argument 1 pro]*
* `+` *[argument 2 pro]*
* `-` *[argument 1 con]*
* *[...]* <!-- numbers of pros and cons can vary -->
