const participantsAndProviders = {
  heading: 'Participants and Providers',
  clearanceHeading: 'Review participants and providers',
  breadcrumb: 'Participants and providers',
  participantsDifferenceHeading:
    'What’s the difference between participants and providers?',
  participantsDifferenceInfo:
    'Participants are <strong>organizations/individuals</strong> that have contracts with CMMI to participate in a model or demonstration. Participants may or may not be Medicare‐enrolled providers.',
  participantsDifferenceInfo2:
    'Providers are <strong>organizations/individuals</strong> that work with the Participants and deliver care or services to the beneficiaries impacted by the model.',
  participantInfo:
    'Participants are organizations/individuals that have contracts with CMMI to participate in a model or demonstration. Participants may or may not be Medicare-enrolled providers.',
  providerInfo:
    'Providers are organizations/indviduals that work with the Participants and deliver care or services to the beneficiaries impacted by our model.',
  whoAreParticipants: 'Who are the participants? Select all that apply.',
  whoAreParticipantsQuestion: 'Who are the participants?',
  participantTypes: {
    medicareProviders: 'Medicare providers',
    entities: 'Entities (e.g., ACO, Direct Contracting Entity)',
    convener: 'Convener',
    medicarePlan: 'Medicare Advantage plans',
    standalonePartD: 'Standalone Part D plans',
    medicarePrescription: 'Medicare Advantage Prescription Drug (MAPD) plans',
    stateMedicaid: 'State Medicaid agencies',
    medicaidManagedCare: 'Medicaid Managed Care organizations',
    medicaidProviders: 'Medicaid providers',
    states: 'States',
    community: 'Community-based organizations',
    nonProfit: 'Non-profit organizations',
    commercial: 'Commercial payers'
  },
  other: 'Other',
  participantsCMMI: 'Are the participants in CMMI models now?',
  participantsCMMIInfo:
    'If you have selected more than one participant in the questions above, specify which participants already participate in CMMI models.',
  modelLevel: 'At what level will the model apply?',
  modelLevelInfo:
    '(e.g., all services identified at the CPT or ICD-10 code level, epsiode of care for a specific span of time, all hospitals unpaid under the Inpatient Prospective Payment System in a certain state)',
  selectedParticipants: 'Selected participants',
  participantQuestions: 'Participant specific questions',
  typeMedicateProvider: 'Which type of medicare providers?',
  describeStates: 'Please describe how states will engage with your model.',
  describeOther:
    'Please describe the other participants engaging with this model',
  howManyParticipants: 'How many participants do you expect?',
  howManyInfo:
    'Note: Sometimes RRCEG provides a minimum for the power calculation. Other times stakeholder research may inform the team about who are good candidates or might be interested in participating.',
  numberOfParticipants: 'Number of participants',
  zero: '0',
  tenThousand: '10,000+',
  estimateConfidence: 'What is your level of confidence on this estimate?',
  estimateOptions: {
    notAtAll: 'Not at all confident',
    slightly: 'Slightly confident',
    fairly: 'Fairly confident',
    completely: 'Completely confident'
  },
  recruitParticipants: 'How will you recruit the participants?',
  recruitOptions: {
    loi: 'LOI (Letter of intent)',
    appCollectionTool: 'Use an application collection tool',
    recruitInfo:
      'CMMI writes, Office of General Council (OGC) reviews and approves',
    nofo:
      'NOFO (Notice of funding opportunity for grants/cooperative agreements)',
    notApplicable: 'Not applicable',
    other: 'Other'
  },
  howWillYouSelect: 'How will you select participants? Select all that appy.',
  howWillYouSelectQuestion: 'How will you select participants?',
  selectOtions: {
    reviewApplications: 'Model team will review applications',
    solicitSupport: 'Solicit support for CMII staff',
    anotherComponent: 'Another CMS component or process will provide support',
    applicationReview: 'Use an application review and scoring tool',
    applicationSupport: 'Get an application support contractor',
    criteria:
      'We have a basic set of criteria and plan to accept any participant that meets them',
    other: 'Other',
    notApplicable: 'We won’t be selecting participants'
  },
  providerConditions: 'What are the provider model enrollment conditions?',
  providerConditionsInfo:
    '(decision points, timing, and liabilities of doing so)',
  providerTermination: 'What are the provider model termination conditions?',
  providerTerminationInfo:
    '(decision points, timing, and liabilities of doing so)',
  participantCommunication: 'How will you communicate with participants?',
  participantCommunicationOptions: {
    sendEmails: 'Send mass emails to new participants',
    itTool: 'Manage ongoing communications with participants using an IT tool',
    noCommunication: 'We are not planning to communicate',
    other: 'Other'
  },
  manageParticipants: 'How will you manage participants?',
  assumeRisk: 'Will the participants assume risk?',
  riskType: 'What type of risk will the participant assume?',
  riskTypeOptions: {
    twoSided: 'Two-sided',
    oneSided: 'One-sided',
    capitalization: 'Capitalization',
    other: 'Other'
  },
  changeRisk: 'Will the risk arrangement change as the model progresses?',
  workCoordination: 'Will the participants coordinate the work of others?',
  workCoordinationNote: '(e.g. conveners)',
  gainsharing: 'Will there be gainsharing payments?',
  collectIDs: 'Will you collect participant IDs?',
  trackPayments: 'Will you track gainsharing payments?',
  collectTINs: 'Will you collect participant IDs? If so, select which types.',
  collectTINsInfo:
    'Note: If this will be a MIPS or Advanced APM, you need to collect provider TIN-NPIs for participants to benefit from QPP. In addition, CPI vetting needs to be preformed.',
  collectTINsOptions: {
    tins: 'TINs',
    npis: 'NPIs',
    ccns: 'CCNs',
    no: 'No, we will not collect provider identifiers',
    other: 'Other'
  },
  frequency: 'How frequently are providers added?',
  frequencyOptions: {
    annually: 'Annually',
    biannually: 'Biannually',
    quarterly: 'Quarterly',
    monthly: 'Monthly',
    rolling: 'Rolling',
    other: 'Other'
  },
  decideProviders:
    'How will you decide to add providers? Select all that apply.',
  decideProvidersQuestion: 'How will you decide to add providers?',
  decideProvidersInfo:
    'Please include details on decision points, timing, and implications of adding them to the model in an additional note.',
  decideProvidersOptions: {
    prospectively: 'Add prospectively (based on previous year’s interactions)',
    retrospectively:
      'Add retrospectively (once an interaction happens this year)',
    voluntarily: 'Add voluntarily',
    manditorily: 'Add mandatorily',
    onlineTools:
      'Use online tools to view what types of participant files and data have been uploaded and downloaded',
    other: 'Other',
    na: 'Not applicable'
  },
  addProvidersHow: 'How you will add providers',
  decideProvidersDescribe:
    'Please describe the other method for deciding which providers to add.',
  canProvidersLeave: 'Can providers leave the model? Select all that apply.',
  canProvidersLeaveQuestion: 'Can providers leave the model?',
  canProvidersLeaveInfo:
    'Please include details on decision points, timing, and implications of leaving the model in an additional note.',
  canProvidersLeaveOptions: {
    voluntarily: 'They can leave voluntarily at any time without implications',
    certainDate:
      'They can leave after a certain date but there are implications',
    varies: 'It varies by type of provider',
    notAllowed: 'They are not allowed to leave',
    other: 'Other',
    notApplicable: 'Not applicable'
  },
  overlap: 'Will the providers overlap with other models?',
  overlapOptions: {
    yes: 'Yes, we expect to develop policies to manage the overlaps',
    yesNoIssue: 'Yes, and the overlaps would not be an issue',
    no: 'No'
  },
  overlapInfo:
    'If model providers can be in multiple models that may interact, please note the desired hierarchy of how any payment changes or edits should be applied.'
};

export default participantsAndProviders;
