# Implementing Tagged Content


[EASI - 3130](https://jiraent.cms.gov/browse/EASI-3130)

There is a new need to be able to tag multiple entities in string content, currently either a user, or a possible operational solution. This involves a few different engineering challenges to address. 

On the backend:
1. How to store an indexable record of a tag.
2. How to store different entity types generically in the database.
3. How to dynamically retrieve different tagged entity in GraphQL.
4. How to parse tag content that is embedded in a string.


On the frontend
1. How to render tagged content in inputs.
2. How to utilize a library to handle tagging for our purposes.
3. How to override tag defaults to provide needed information to store tags on the backend.

To research these issues, a [POC branch](https://github.com/CMS-Enterprise/mint-app/tree/EASI-3130/discussion_tagging_spike_poc) was created, and made into a [Draft PR](https://github.com/CMS-Enterprise/mint-app/pull/702)

## Backend Discoveries

### Parsing tags
* Parse Tag content
* Send Tag content as well as raw tags

The backend explored two options for parsing or storing tagged strings, either a. parse the content and store directly or b. require raw content as well as a second input for tagged content information. Option b opens up data integrity issues, as the tags could potentially not match the raw content. As such, we selected option a. It can be accomplished by using regex capture groups to parse and validate the tags. If HTML is implemented for rich text, parsing can also be done using HTML libraries (this was also tested in the POC branch).

### Store Separate entities as tags in the database
To handle the need to store different entity types in the database, we explored the idea of a tag type. This type is used when parsing the data structure to programmatically populate the tag based on required data. (For example, a user account has an id of type UUID, and a possible solution has an if of type int.)


### Indexable records
On the database side, there is a balance between flexibility, and indexability. To allow completely relational tags, you need to map a foreign key relationship. With data that maps to multiple different types, you can't use the same column as a foreign key relationship to different tables. To allow for greater flexibility, we implemented a generic tag table. This table maps the type of tag, the source table, the source table field, and the source table primary key. This allows future flexibility to add tags to other columns and tables. This still allows for joining, and dynamic retrieval of data. If desired, we can split this into more granular tables in the future without causing issues.

### Dynamically return different tagged entities
As a tag can represent different entities, we needed a way to dynamically return different result types in the same field. GraphQL has the concept of a union type which allows this. To support this on the backend, you need to define an interface that has the same name as the union type, and implement it on the GO types you would like to return. With the data in the tag, we can dynamically return either a user account or possible operational solution.


## Frontend Discoveries
The options for frontend capabilities of tagging/mentions are split between:

- Specific package that works with existing html textarea elements solely for tagging
- Rich Text Editor tooling that replaces current text/textarea capabilities (includes tagging/mentions)

## Considered Options

* [React-Mentions](https://github.com/signavio/react-mentions) [PoC Branch](https://github.com/CMS-Enterprise/mint-app/tree/EASI-3130/discussion_tagging_spike_poc)
* [TipTap (Rich Text Editor)](https://tiptap.dev/)
* [ToastUI (Rich Text Editor)](https://ui.toast.com/tui-editor)

## Decision Outcome

TipTap

We foresee a future business need for a rich text editor and decided to go with an option where we could leverage mention capability, while scoping for future feature requirements.  The PoC branch work successfully demonstrated the capabilities for mentions as well as the ability to leverage RTE features.  The library was well documented, easy to set up, and allows for enough flexibility with both UI customization and functionality.

EASI currently has ToastUI implemented in a single instance in the application.  The decision to part in tooling here is due to difference business needs.  MINT may use this time to validate TipTap as preferred tool.  EASI may have a future need for mention capability, and it may be worth revisiting EASI's RTE tooling upon verification of the success and usefulness of TipTap. 


## Pros and Cons of the Options

### React-Mentions
* `+` OOB mention functionality
* `+` Package serves single purpose
* `+` Good documentation
* `-` Will need to replaced if we ever need to implement a RTE

### TipTap (Rich Text Editor)
* `+` Offers RTE capabilities in addition to mention capability
* `+` Great documentation
* `+` Community support - examples, extension, and plugins
* `+` Robust flexibility and configuration for UI and functionality
* `-` More configuration/coordination needed to integrate with BE and CSV export
* `-` Divergence from EASI's Toast RTE

### ToastUI (Rich Text Editor)
* `+` EASI has already implemented this RTE
* `+` Decent documentation
* `+` Decent Community support
* `-` Some hacky solutions were needed to meet EASI's business case needs
* `-` No OOB support for mention functionality - closest would be an autocomplete component
