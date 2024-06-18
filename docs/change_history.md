# Change History

Change history is a MINT feature that aims to give full transparency into model changes and when they occurred.



#### Here are some features of Change History:

- Changes are captured and stored as 'moment-in-time'.  Regardless of future changes that may alter text, changes are stored fully translated in English within the database.
- No historical changes are captured.  Changes only are recorded from the moment the feature is deployed to production
- Changes are model plan specific, and no user preference, etc. changes are currently captured
- A job runs on the server once per minute to translate audits from a queue.
- Any user/job code can access Change History, however some data that would normally be restricted in the read view, will be hidden from Change History

## Configuration

#### Steps to add new translations for Change History

- ##### New Table

  - TODO:
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
