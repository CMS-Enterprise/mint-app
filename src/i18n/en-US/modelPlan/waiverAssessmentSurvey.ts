import { TranslationWaiverAssessmentSurvey } from 'types/translation';

import {
  NotSelectedReason,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const notSelectedReasonOptions: Record<NotSelectedReason, string> = {
  OUT_OF_SCOPE: 'Outside of model scope (e.g. Medicaid-only waiver)',
  OVERLAPS:
    'Waiver overlaps with another model test or incentive (e.g. payment or scope of practice)',
  NOT_TESTING:
    'The model will not be testing this waiver or payment type (e.g. bundles)',
  NOT_ENGAGED:
    'The model does not engage with the user of this waiver (e.g. WISeR, CGT)',
  FEEDBACK_AGAINST_USE: 'Feedback from participants against waiver use',
  OTHER: 'Other'
};

const waiverAssessmentSurvey: TranslationWaiverAssessmentSurvey = {
  modifiesMedicareSavingsPrograms: {
    gqlField: 'modifiesMedicareSavingsPrograms',
    goField: 'ModifiesMedicareSavingsPrograms',
    dbField: 'modifies_medicare_savings_programs',
    label: 'Does your model modify Medicare shared savings programs?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 3.01,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () => waiverAssessmentSurvey.modifiesMedicareSavingsProgramsExample
      ],
      false: [
        () => waiverAssessmentSurvey.modifiesMedicareSavingsProgramsWhyNot
      ]
    }
  },
  modifiesMedicareSavingsProgramsExample: {
    gqlField: 'modifiesMedicareSavingsProgramsExample',
    goField: 'ModifiesMedicareSavingsProgramsExample',
    dbField: 'modifies_medicare_savings_programs_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.011,
    parentRelation: () => waiverAssessmentSurvey.modifiesMedicareSavingsPrograms
  },
  modifiesMedicareSavingsProgramsWhyNot: {
    gqlField: 'modifiesMedicareSavingsProgramsWhyNot',
    goField: 'ModifiesMedicareSavingsProgramsWhyNot',
    dbField: 'modifies_medicare_savings_programs_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 3.012,
    parentRelation: () => waiverAssessmentSurvey.modifiesMedicareSavingsPrograms
  },
  bundlesPayments: {
    gqlField: 'bundlesPayments',
    goField: 'BundlesPayments',
    dbField: 'bundles_payments',
    label: 'Does your model bundle payments?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 3.02,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [() => waiverAssessmentSurvey.bundlesPaymentsExample],
      false: [() => waiverAssessmentSurvey.bundlesPaymentsWhyNot]
    }
  },
  bundlesPaymentsExample: {
    gqlField: 'bundlesPaymentsExample',
    goField: 'BundlesPaymentsExample',
    dbField: 'bundles_payments_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.021,
    parentRelation: () => waiverAssessmentSurvey.bundlesPayments
  },
  bundlesPaymentsWhyNot: {
    gqlField: 'bundlesPaymentsWhyNot',
    goField: 'BundlesPaymentsWhyNot',
    dbField: 'bundles_payments_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 3.022,
    parentRelation: () => waiverAssessmentSurvey.bundlesPayments
  },
  offersRiskSharingArrangements: {
    gqlField: 'offersRiskSharingArrangements',
    goField: 'OffersRiskSharingArrangements',
    dbField: 'offers_risk_sharing_arrangements',
    label: 'Does your model offer risk sharing arrangements?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 3.03,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [() => waiverAssessmentSurvey.offersRiskSharingArrangementsExample],
      false: [() => waiverAssessmentSurvey.offersRiskSharingArrangementsWhyNot]
    }
  },
  offersRiskSharingArrangementsExample: {
    gqlField: 'offersRiskSharingArrangementsExample',
    goField: 'OffersRiskSharingArrangementsExample',
    dbField: 'offers_risk_sharing_arrangements_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.031,
    parentRelation: () => waiverAssessmentSurvey.offersRiskSharingArrangements
  },
  offersRiskSharingArrangementsWhyNot: {
    gqlField: 'offersRiskSharingArrangementsWhyNot',
    goField: 'OffersRiskSharingArrangementsWhyNot',
    dbField: 'offers_risk_sharing_arrangements_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 3.032,
    parentRelation: () => waiverAssessmentSurvey.offersRiskSharingArrangements
  },
  impactsSiteOfCarePayments: {
    gqlField: 'impactsSiteOfCarePayments',
    goField: 'ImpactsSiteOfCarePayments',
    dbField: 'impacts_site_of_care_payments',
    label: 'Will your model be impacting site of care payments?',
    sublabel: 'For example: telehealth, at home',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.01,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [() => waiverAssessmentSurvey.impactsSiteOfCarePaymentsExample],
      false: [() => waiverAssessmentSurvey.impactsSiteOfCarePaymentsWhyNot]
    }
  },
  impactsSiteOfCarePaymentsExample: {
    gqlField: 'impactsSiteOfCarePaymentsExample',
    goField: 'ImpactsSiteOfCarePaymentsExample',
    dbField: 'impacts_site_of_care_payments_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 4.011,
    parentRelation: () => waiverAssessmentSurvey.impactsSiteOfCarePayments
  },
  impactsSiteOfCarePaymentsWhyNot: {
    gqlField: 'impactsSiteOfCarePaymentsWhyNot',
    goField: 'ImpactsSiteOfCarePaymentsWhyNot',
    dbField: 'impacts_site_of_care_payments_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 4.012,
    parentRelation: () => waiverAssessmentSurvey.impactsSiteOfCarePayments
  },
  modifiesCareTeamScopeOfPractice: {
    gqlField: 'modifiesCareTeamScopeOfPractice',
    goField: 'ModifiesCareTeamScopeOfPractice',
    dbField: 'modifies_care_team_scope_of_practice',
    label: 'Will your model be modifying the care teams’ scope of practice?',
    sublabel: 'For example: NP/PA flexibility, CHW inclusion, etc.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.02,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () => waiverAssessmentSurvey.modifiesCareTeamScopeOfPracticeExample
      ],
      false: [
        () => waiverAssessmentSurvey.modifiesCareTeamScopeOfPracticeWhyNot
      ]
    }
  },
  modifiesCareTeamScopeOfPracticeExample: {
    gqlField: 'modifiesCareTeamScopeOfPracticeExample',
    goField: 'ModifiesCareTeamScopeOfPracticeExample',
    dbField: 'modifies_care_team_scope_of_practice_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 4.021,
    parentRelation: () => waiverAssessmentSurvey.modifiesCareTeamScopeOfPractice
  },
  modifiesCareTeamScopeOfPracticeWhyNot: {
    gqlField: 'modifiesCareTeamScopeOfPracticeWhyNot',
    goField: 'ModifiesCareTeamScopeOfPracticeWhyNot',
    dbField: 'modifies_care_team_scope_of_practice_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 4.022,
    parentRelation: () => waiverAssessmentSurvey.modifiesCareTeamScopeOfPractice
  },
  modifiesCareDeliveryWithClaimsBasedPayments: {
    gqlField: 'modifiesCareDeliveryWithClaimsBasedPayments',
    goField: 'ModifiesCareDeliveryWithClaimsBasedPayments',
    dbField: 'modifies_care_delivery_with_claims_based_payments',
    label:
      'Will your model be modifying how care is delivered with claims-based payments?',
    sublabel: 'For example: diabetic shoes',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.03,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () =>
          waiverAssessmentSurvey.modifiesCareDeliveryWithClaimsBasedPaymentsExample
      ],
      false: [
        () =>
          waiverAssessmentSurvey.modifiesCareDeliveryWithClaimsBasedPaymentsWhyNot
      ]
    }
  },
  modifiesCareDeliveryWithClaimsBasedPaymentsExample: {
    gqlField: 'modifiesCareDeliveryWithClaimsBasedPaymentsExample',
    goField: 'ModifiesCareDeliveryWithClaimsBasedPaymentsExample',
    dbField: 'modifies_care_delivery_with_claims_based_payments_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 4.031,
    parentRelation: () =>
      waiverAssessmentSurvey.modifiesCareDeliveryWithClaimsBasedPayments
  },
  modifiesCareDeliveryWithClaimsBasedPaymentsWhyNot: {
    gqlField: 'modifiesCareDeliveryWithClaimsBasedPaymentsWhyNot',
    goField: 'ModifiesCareDeliveryWithClaimsBasedPaymentsWhyNot',
    dbField: 'modifies_care_delivery_with_claims_based_payments_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 4.032,
    parentRelation: () =>
      waiverAssessmentSurvey.modifiesCareDeliveryWithClaimsBasedPayments
  },
  modifiesQualityMeasurementsOrPaymentsViaWaivers: {
    gqlField: 'modifiesQualityMeasurementsOrPaymentsViaWaivers',
    goField: 'ModifiesQualityMeasurementsOrPaymentsViaWaivers',
    dbField: 'modifies_quality_measurements_or_payments_via_waivers',
    label:
      'Will your model be modifying quality measurements or payments via waivers?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.04,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () =>
          waiverAssessmentSurvey.modifiesQualityMeasurementsOrPaymentsViaWaiversExample
      ],
      false: [
        () =>
          waiverAssessmentSurvey.modifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot
      ]
    }
  },
  modifiesQualityMeasurementsOrPaymentsViaWaiversExample: {
    gqlField: 'modifiesQualityMeasurementsOrPaymentsViaWaiversExample',
    goField: 'ModifiesQualityMeasurementsOrPaymentsViaWaiversExample',
    dbField: 'modifies_quality_measurements_or_payments_via_waivers_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 4.041,
    parentRelation: () =>
      waiverAssessmentSurvey.modifiesQualityMeasurementsOrPaymentsViaWaivers
  },
  modifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot: {
    gqlField: 'modifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot',
    goField: 'ModifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot',
    dbField: 'modifies_quality_measurements_or_payments_via_waivers_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 4.042,
    parentRelation: () =>
      waiverAssessmentSurvey.modifiesQualityMeasurementsOrPaymentsViaWaivers
  },
  impactsMedicaidOnlyBeneficiaries: {
    gqlField: 'impactsMedicaidOnlyBeneficiaries',
    goField: 'ImpactsMedicaidOnlyBeneficiaries',
    dbField: 'impacts_medicaid_only_beneficiaries',
    label: 'Does your model impact Medicaid-only beneficiaries?',
    sublabel: 'Not including duals.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.01,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () => waiverAssessmentSurvey.impactsMedicaidOnlyBeneficiariesExample
      ],
      false: [
        () => waiverAssessmentSurvey.impactsMedicaidOnlyBeneficiariesWhyNot
      ]
    }
  },
  impactsMedicaidOnlyBeneficiariesExample: {
    gqlField: 'impactsMedicaidOnlyBeneficiariesExample',
    goField: 'ImpactsMedicaidOnlyBeneficiariesExample',
    dbField: 'impacts_medicaid_only_beneficiaries_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.011,
    parentRelation: () =>
      waiverAssessmentSurvey.impactsMedicaidOnlyBeneficiaries
  },
  impactsMedicaidOnlyBeneficiariesWhyNot: {
    gqlField: 'impactsMedicaidOnlyBeneficiariesWhyNot',
    goField: 'ImpactsMedicaidOnlyBeneficiariesWhyNot',
    dbField: 'impacts_medicaid_only_beneficiaries_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 5.012,
    parentRelation: () =>
      waiverAssessmentSurvey.impactsMedicaidOnlyBeneficiaries
  },
  impactsHomeCommunityBasedServicePayments: {
    gqlField: 'impactsHomeCommunityBasedServicePayments',
    goField: 'ImpactsHomeCommunityBasedServicePayments',
    dbField: 'impacts_home_community_based_service_payments',
    label: 'Does your model impact home- and community-based service payments?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.02,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () =>
          waiverAssessmentSurvey.impactsHomeCommunityBasedServicePaymentsExample
      ],
      false: [
        () =>
          waiverAssessmentSurvey.impactsHomeCommunityBasedServicePaymentsWhyNot
      ]
    }
  },
  impactsHomeCommunityBasedServicePaymentsExample: {
    gqlField: 'impactsHomeCommunityBasedServicePaymentsExample',
    goField: 'ImpactsHomeCommunityBasedServicePaymentsExample',
    dbField: 'impacts_home_community_based_service_payments_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.021,
    parentRelation: () =>
      waiverAssessmentSurvey.impactsHomeCommunityBasedServicePayments
  },
  impactsHomeCommunityBasedServicePaymentsWhyNot: {
    gqlField: 'impactsHomeCommunityBasedServicePaymentsWhyNot',
    goField: 'ImpactsHomeCommunityBasedServicePaymentsWhyNot',
    dbField: 'impacts_home_community_based_service_payments_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 5.022,
    parentRelation: () =>
      waiverAssessmentSurvey.impactsHomeCommunityBasedServicePayments
  },
  impactsManagedCareWaivers: {
    gqlField: 'impactsManagedCareWaivers',
    goField: 'ImpactsManagedCareWaivers',
    dbField: 'impacts_managed_care_waivers',
    label: 'Does your model impact managed care waivers?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.03,
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [() => waiverAssessmentSurvey.impactsManagedCareWaiversExample],
      false: [() => waiverAssessmentSurvey.impactsManagedCareWaiversWhyNot]
    }
  },
  impactsManagedCareWaiversExample: {
    gqlField: 'impactsManagedCareWaiversExample',
    goField: 'ImpactsManagedCareWaiversExample',
    dbField: 'impacts_managed_care_waivers_example',
    label: 'Please provide an example',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.031,
    parentRelation: () => waiverAssessmentSurvey.impactsManagedCareWaivers
  },
  impactsManagedCareWaiversWhyNot: {
    gqlField: 'impactsManagedCareWaiversWhyNot',
    goField: 'ImpactsManagedCareWaiversWhyNot',
    dbField: 'impacts_managed_care_waivers_why_not',
    label: 'Please explain why not',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: notSelectedReasonOptions,
    order: 5.032,
    parentRelation: () => waiverAssessmentSurvey.impactsManagedCareWaivers
  },
  additionalMedicaidSpecificWaivers: {
    gqlField: 'additionalMedicaidSpecificWaivers',
    goField: 'AdditionalMedicaidSpecificWaivers',
    dbField: 'additional_medicaid_specific_waivers',
    label:
      'Are there any other Medicaid-specific waivers of interest that are not outlined here?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.04
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Questionnaire status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 8.01,
    options: {
      READY: 'Not started',
      IN_PROGRESS: 'In progress',
      COMPLETE: 'Complete'
    },
    hideFromReadonly: true
  },
  isComplete: {
    gqlField: 'isComplete',
    goField: 'IsComplete',
    dbField: 'is_complete', // Note: Computed from status field
    label: 'Questionnaire status',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 8.02,
    options: {
      true: 'This questionnaire (4i and ACO-OS) is complete.',
      false: 'No'
    },
    hideFromReadonly: true
  }
};

const waiverAssessmentSurveyMisc = {
  heading: 'Waiver Assessment Survey',
  bannerText:
    'Your waiver assessment survey can only be accessed by one person at a time. If you are not actively editing or reviewing this section, please exit out of it so others can access it.',
  description:
    'The mandatory Program and Payment Waiver Assessment Survey helps CMMI to determine which models will use which waivers. CMMI Leadership assumes that program and payment waivers will be utilized in all new models unless specifically justified otherwise. This policy shift reflects our commitment to maximizing flexibility and innovation potential while maintaining appropriate oversight and beneficiary protections. Model Leads within the Center for Medicare and Medicaid Innovation (CMMI) play a critical role in developing innovative healthcare delivery and payment models that advance the triple aim of better care, healthier populations, and lower costs.',
  needHelpDiscussion: 'Need help with your waiver assessment survey?',
  aboutWaiverAssessmentSurvey: {
    heading: 'About completing the waiver assessment survey',
    description:
      'This survey will help determine which specific waivers are most appropriate for your model, ensure proper justification for waiver selections, and identify any instances where standard CMS authorities may be sufficient without additional waiver flexibility.',
    whyDoINeedToCompleteThisSurvey: 'Why do I need to complete this survey?',
    yourResponsesWill: 'Your responses will:',
    whyDoINeedToCompleteThisSurveyItems: [
      'Inform stakeholder engagement strategies',
      'Support operational planning and implementation timelines',
      'Ensure compliance with statutory and regulatory requirements'
    ],
    whosInvolved: 'Who’s involved',
    whosInvolvedDescription:
      'Model Leads (with the assistance of other model team members as necessary), will work to complete this survey and help determine which waivers are needed for this model. This will help the Front Office, group leadership, and other MINT users understand which waivers you are utilizing and understands the reasons why you are not using other available waivers. If you have any questions, please contact Grace Goodhew or Megan Hyde in LDG, or email the MINT Team.',
    modelTeam: 'Model team',
    modelTeamDescription:
      'Model leads or model team members responsible for data-centric activities should work with the IT Lead or Solution Architect to complete the questions in this approach.',
    modelLead: 'Model Lead',
    email: 'Email the MINT Team',
    whatHappenNext: 'What happens next',
    whatHappenNextDescription:
      'Your model will be automatically added to a list outlining all of the waivers used across all CMMI models. The CMMI Front Office (FO), group leadership, and other users will have access to which waivers you are utilizing, as well as your answers where you are not using waivers. '
  },
  modelPlanQuestions: {
    heading: 'Model Plan questions',
    description:
      'The following questions are included in your Model Plan and will help verify which waivers may be required for your model. Please check any answers entered and update any that are not accurate.',
    infoAlert:
      'Any answers updated as a part of this survey will also be updated in the Model Plan.',
    updateAnswers: 'Update answers (show questions)',
    hideQuestions: 'Hide questions'
  },
  waiverInfoPanel: {
    heading: 'Waiver information',
    participationAgreementLanguage: 'Link to Participation Agreement Language',
    cmmiWaiverPointOfContact: 'CMMI Waiver Point Of Contact',
    noPointOfContactListed: 'No point of contact listed',
    waiverType: 'Waiver type',
    waiverTypeLabels: {
      MEDICARE_PAYMENT: 'Payment',
      PROGRAM_MEDICARE_BE: 'Program',
      MEDICAID_PAYMENT: 'Medicaid'
    },
    waiverFocus: 'Waiver focus',
    whatIsWaived: 'What is waived?',
    hasStandardizationEffort: 'Is there a waiver standardization effort?',
    hasClaimsDataOrRREGAnalysis: 'Is claims data or RREG analysis available?',
    isUsedInActiveModels: 'Is this waiver used in active models?',
    willUseWaiverLabel: 'Do you plan to use this waiver with your model?',
    willUseWaiverHelpText:
      'Your answer to this question may reveal additional questions to be answered.',
    willUseWaiver_true: 'You said your model will use this waiver.',
    willUseWaiver_false: 'You said your model will not use this waiver.',
    changeResponse: 'Change response',
    notUsingReason: 'Please explain why your model is not using this waiver.'
  },
  medicarePaymentWaivers: {
    heading: 'Medicare payment waivers',
    description:
      'The following questions will help us rule out waivers that may not be applicable to your model, reducing the total number of questions you need to answer to complete this survey. Specifically, your answers in this section may help rule out any groups of Medicare payment waivers. More often than not, if you are not using one waiver in a grouping, that group of waivers doesn’t apply to your model.',
    waiverTypeText: 'Medicare payment waivers'
  },
  programWaivers: {
    heading: 'Program waivers - Medicare Benefit Enhancements (BEs)',
    description:
      'The following questions will help us rule out waivers that may not be applicable to your model, reducing the total number of questions you need to answer to complete this survey. Specifically, your answers in this section may help rule out any groups of Program waivers (Medicare BEs). More often than not, if you are not using one waiver in a grouping, that group of waivers doesn’t apply to your model.',
    waiverTypeText: 'Program waivers (Medicare BEs)'
  },
  medicaidPaymentWaivers: {
    heading: 'Medicaid payment waivers',
    description:
      'The following questions will help us rule out waivers that may not be applicable to your model, reducing the total number of questions you need to answer to complete this survey. Specifically, your answers in this section may help rule out any groups of Medicaid payment waivers. More often than not, if you are not using one waiver in a grouping, that group of waivers doesn’t apply to your model.',
    waiverTypeText: 'Medicaid payment waivers'
  },
  waiverSelectionAndConfirmation: {
    heading: 'Waiver selection and confirmation',
    description:
      'Confirm which waivers your model will use, and justify any you plan not to use. You may also review waivers that have been ruled out by previous questions and you may select them for your model to use.',
    waiverName: 'WAIVER NAME',
    learnMoreAboutThisWaiver: 'Learn more about this waiver',
    iPlanToUseThisWaiver: 'I plan to use this waiver for my model',
    unusedWaiver: {
      heading: 'Unused waivers',
      description:
        'The waivers below were filtered out based on your answers earlier in this form. If you see any that you know your model will use, please select the button labeled “I plan to use this waiver for my model”. To see more details about each waiver, including a description and other information, please select the button labeled “Learn more about this waiver”.',
      name: 'Waiver name',
      action: 'Actions'
    }
  },
  selectedWaivers: {
    heading: 'Selected waivers',
    description:
      'There are {{-totalWaiversCount}} total available {{-waiverType}}. Based on your answers to the above questions, MINT has determined that the following {{-selectedWaiversCount}} waivers are likely needed for your model:',
    summary:
      'Adjusting your answers to the questions above may change the list of selected waivers. In a later step, you will be able to confirm this list and/or rule out additional waivers.'
  }
};

export { waiverAssessmentSurvey, waiverAssessmentSurveyMisc };
