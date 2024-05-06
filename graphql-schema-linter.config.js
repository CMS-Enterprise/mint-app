module.exports = {
  schemaPaths: ['pkg/graph/schema/**/*.graphql'],
  rules: [
    //   "arguments-have-descriptions",
    'defined-types-are-used',
    'deprecations-have-a-reason',
    'descriptions-are-capitalized',
    'enum-values-all-caps',
    // 'enum-values-have-descriptions',
    // 'enum-values-sorted-alphabetically',
    'fields-are-camel-cased',
    //   "fields-have-descriptions",
    // 'input-object-fields-sorted-alphabetically',
    'input-object-values-are-camel-cased',
    //   "input-object-values-have-descriptions",
    // 'interface-fields-sorted-alphabetically',
    // "relay-connection-arguments-spec",
    // "relay-connection-types-spec",
    // "relay-page-info-spec",
    // 'type-fields-sorted-alphabetically',
    'types-are-capitalized'
  ],
  ignore: {
    'defined-types-are-used': [
      'TranslationField',
      'TranslationFieldWithOptions',
      'TranslationDataType',
      'TranslationFormType',
      'ModelPlanTranslation',
      'PlanBasicsTranslation',
      'PlanGeneralCharacteristicsTranslation',
      'PlanParticipantsAndProvidersTranslation',
      'PlanBeneficiariesTranslation',
      'PlanOpsEvalAndLearningTranslation',
      'PlanPaymentsTranslation',
      'PlanCollaboratorTranslation',
      'PlanDiscussionsTranslation',
      'PlanCRsTranslation',
      'PlanTDLsTranslation',
      'TranslationFieldWithParent',
      'TranslationFieldWithOptionsAndChildren',
      'TranslationFieldWithOptionsAndParent',
      'TranslationFieldWithParentAndChildren'
    ]
  }
};
