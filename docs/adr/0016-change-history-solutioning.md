# Model Plan Change History

**User Story:** [EASI-4182](https://jiraent.cms.gov/browse/EASI-4182)

A new feature is going to be implemented in MINT, exposing change history in a manner that is viewable on the front end. We currently have data auditing happening in the database, however this is not human readable, and not easily searchable ([see data auditing](0007-adr-data-auditing.md)).

As such, we need the ability to translate the data that is already stored, or change how we store the data.

## Decision Outcome

### Translating Data

Translating data is a nuanced issue. The front end is currently able to translate a question into multiple languages if desired. There is difficulty translating change history data, because we update the application, moving, updating and potentially removing questions being asked. If we want to translate a historic record, we'd need to version our translations, which increases the complexity of the process.

We have decided to translate an audit record shortly after it is made, and store the translated audit record in the database. This will allow us access to the translation that is correct for the data at the time the change is made.

### Translation Mapping Source

The front end team has worked extensively creating translations for the the application. To translate the data and store in the database, the backend needs to know the information.

Rather than rework the translation, we are going to leverage the existing translation. We can utilize GraphQL to generate a shared type utilized by both the front end and the backend. The frontend can export the implementation of those types as a JSON file. The backend can then deserialize the JSON, and translate it to a useable form to generically translate an audit record.

### Relational information

Similar to the need for translating data near the time it was changed, we also need to get relational information at the same time the change was made. For example, when a user is added as a collaborator, they are represented as UUID. A UUID is not useful information for this information, instead we care about the name of the user who made the change.

When we translate the data, we can also store table and action specific meta data about this change. For example, the name of the user who was added as a collaborator instead of the UUID of their account

### Historic Records Before this new feature

As stated above, it is difficult to translate historic data, because questions have changed and moved to different sections. We can't guarantee that there is a mapping in place for historic audit data. As such, historic records prior to this feature will not be translated to a human readable format.

### Table Structure

We plan on flattening the audit structure that is in the audit schema. We will expand the field to have a record per field for easier searchability. We will maintain the connection to the audit schema. We will also plan on grouping the changes to the same transaction (similar to how the audit table groups all changed fields). If feasible, this will be represented as a table that has a 1:1 entry for the audit change table. The fields will be in a separate table that map to new translated table.

We will also expose some more information to make future filtering and searching easier (the id of the model plan etc)

### Translation Job

There are many possible implementations for a job to translate the data. We plan to make implementation generic enough to be able to easily switch between options. Practically, this means we will keep business logic separate from the job logic.

Practically speaking, we are already using factory (see [worker framework](0006-adr-worker-framework.md)) for other jobs. We will plan to use factory for the first pass implementation. If we ever adopt a micro-service framework, this job could be it's own service separate from factory.

### Deprecate Autosave
Currently, the frontend implements autosave to save all of our form data. This feature creates numerous transactions during the course of a form being filled out. While this does mean that data is saved very quickly, it makes the audit trail less meaningful (as parts of sentences could show up as a separate changes). 

To make more meaningful change groupings, we are going to save on navigation instead of saving after a small period of time. This will allow us to show all the changes that happened at the same time in a meaningful manner. We will ensure that saving data remains an easy intuitive experience. 
