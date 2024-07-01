# Change History

Change history is a MINT feature that aims to give full transparency into model changes and when they occurred.

#### Here are some features of Change History:

- Changes are captured and stored as 'moment-in-time'.  Regardless of future changes that may alter text, changes are stored fully translated in English within the database.
- No historical changes are captured.  Changes only are recorded from the moment the feature is deployed to production
- Changes are model plan specific, and no user preference, etc. changes are currently captured
- A job runs on the server once per minute to translate audits from a queue.
- Any user/job code can access Change History, however some data that would normally be restricted in the read view, will be hidden from Change History

## Configuration
### Adding new audit tables in the database
- Use the `SELECT audit.AUDIT_TABLE` method in the database to add a table configuration, and to enable the audit trigger on that table. Reference the database for the most up to date documentation on the trigger.

`Example`
```SQL
  SELECT audit.AUDIT_TABLE(''public'', ''testing_table'', ''id'', NULL, ''{created_by,created_dts,modified_by,modified_dts}''::TEXT[], ''{*,id}''::TEXT[])
```
 
  NOTE: if the `testing_table` enum value did not exist on the `TABLE_NAME` type, it would need to be added for this to work
```SQL
    ALTER TYPE TABLE_NAME ADD VALUE ''testing_table'';
```

- If a new table is added, be sure to add the new enum value to `TableName` in the [shared_enums go file](../pkg/models/shared_enums.go), and in [GQL](../pkg/graph/schema/types/shared_enums.graphql)

#### Steps to add new translations for Change History (FE?)

- ##### Addition to an Existing Table

  - Access the schema for the desired table in [/pkg/graph/schema/types/](../pkg/graph/schema/types/)
    - This file will always be appended with `_translation.graphql`
  - Add the new field property and it's corresponding type
    - ex: `TranslationField!` or `TranslationFieldWithOptions!`
    - The value on the `gotag` will be the database field name
  - Run `scripts/dev gql` command to execute `graphql-codegen`
  - Access [/src/types/translation/](../src/types/translation.ts)
  - Import any gql enums that are value types of the new property
  - Navigate to the property's table typescript definition
  - Add the property definition to the table
    - This includes assigning any enums that will be supplied to the generic
    - Example: `modelCategory: TranslationFieldPropertiesWithOptions<ModelCategory>`
  - Access the relevant i18n translation file within [/src/i18n/modelPlan/](../src/i18n/modelPlan)
  - Add the property as JSON configuration
    - Including options that correspond to any enum/generic values
    - If the new property belongs to a filter group, that configuration belongs here
    - Refer to the in-code documentation for all the configuration options
  - Export the edits typescript translation file with the command `yarn ts-node ./mappings/export/exportTranslation.ts`
  - Verify the new property and its configuration is exported as JSON to [/pkg/mappings/export/translation/](../pkg/mappings/export/translation/)

- ##### New Table

  - Create schema file for new table in [/pkg/graph/schema/types/](../pkg/graph/schema/types/)
    - File should be appended with `_translation.graphql`
  - Add any table field properties and their corresponding type
    - ex: `TranslationField!` or `TranslationFieldWithOptions!`
    - The value on the `gotag` will be the database field name
  - Add table name to the ignore `defined-types-are-used` list here [/graphql-schema-linter.config.js](../graphql-schema-linter.config.js)
    - Graphql codegen expects all defined schema types to be used in a resolver.  This tells codegen that we do not intend to use these defined types in the conventional method.
   - Run `scripts/dev gql` command to execute `graphql-codegen`
   - Add the table to `translationSections` within [/pkg/mappings/export/exportTranslation/](../pkg/mappings/export/exportTranslation/) and [/pkg/mappings/export/util/](../pkg/mappings/export/util/)
     - Import any necessary types from the new code generated with codegen
   - Add the table and it's property mappings to [/src/types/translation/](../src/types/translation.ts)
   - Add the table translation file in [/src/i18n/modelPlan/](../src/i18n/modelPlan)
   - Populate the translation file with JSON config for text, options, etc


- ##### Extending properties of translation configuration
 - TODO?
 


 ### Backend Generated Type Wiring
  #### Implement Interface for Generated Type
  - Implement the Translation Interface defined in [mappings/translation_interface.go](../mappings/translation_interface.go)
    - Go into [pkg/graph/model/translation_extensions.go](../pkg/graph/model/translation_extensions.go)
      - Implement `TableName()`
      - Implement `ToMap()`

#### Backend Wiring of Generated Translations
  
  - Create a new file, and test in [mappings](../mappings/)
      - File should be appended with `_translation.go`
  - Embed the exported JSON translation from [mappings/translation](../mappings/translation/)
    - Create a Function that returns the generated type, and error by deserializing the embedded json to the deserialized type
  - Update `GetTranslation` in [mappings/translation_utilities.go](../mappings/translation_utilities.go) to add an entry to return the new translation. ( This is how the translation audit job gets the translation)
  - Create a unit test file in the mapping directory. 
     - Add a test that asserts the data can be deserialized and the `ToMap()` function works
     - Add a test to `VerifyFieldsArePopulated`. This should call `assertTranslationFields`
     - Add a test to verify `TranslationCoverage` this should call `assertTranslationStructCoverage`
         - this can explicitly provide fields that we expect not to be translated.
