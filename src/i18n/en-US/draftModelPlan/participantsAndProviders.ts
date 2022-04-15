const participantsAndProviders = {
  heading: 'Participants and Providers',
  participantInfo:
    'Participants are organizations/individuals that have contracts with CMMI to participate in a model or demonstration. Participants may or may not be Medicare-enrolled providers.',
  providerInfo:
    'Providers are organizations/indviduals that work with the Participants and deliver care or services to the beneficiaries impacted by our model.',
  whoAreParticipants: 'Who are the particpants? Select all that apply.',
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
  estimateConfidence: 'What is your level of confidence on this esitmate?',
  estimateOptions: {
    notAtAll: 'Not at all confident',
    slightly: 'Slightly confident',
    fairly: 'Fairly confident',
    completely: 'Compeletely confident'
  },
  recruitPartifipants: 'How will you recruit the participants?',
  recruitOptions: {
    loi: 'LOI (Letter of interest)',
    rfa: 'RFA (Request for applications)',
    recruitInfo:
      'CMMI writes, Office of General Council (OGC) reviews and approves',
    nofo:
      'NOFO (Notice of funding opportunity for grants/cooperative agreements',
    notApplicable: 'Not applicable, it is a mandatory model'
  },
  howWillYouSelect: 'How will you select participants? Select all that appy.',
  selectOtions: {
    reviewApplications: 'Model team wil review applications',
    solicitSupport: 'Solicit support for CMII staff',
    anotherComponent: 'Another CMS component or process will prived support',
    applicationReview: 'Use an Application Review and Scoring tool',
    applicationSupport: 'Get an application support contractor',
    criteria:
      'We have a basic set of criteria and plan to accept any participant that meets them',
    anotherProcess:
      'Another CMS process or component supports participant selection',
    notApplicable: 'Not applicable, it is a mandatory model'
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
    noCommunication: 'We are not planning to communicate'
  },
  manageParticipants: 'How will you manage participants?',
  manageParticipantsOptions: {
    prospectively:
      'Enroll prospectively (based on previous year’s interactions)',
    retrospectively:
      'Enroll retrospectively (once an interaction happens this year)',
    voluntarily: 'Enroll voluntarily',
    manditorily: 'Enroll mandatorily',
    onlineTools:
      'Use online tools to view what types of participant files and data have been uploaded and downloaded'
  },
  assumeRisk: 'Will the participants assume risk?',
  riskType: 'What type of risk will the participant assume?',
  riskTypeOptions: {
    twoSided: 'Two-sided',
    oneSided: 'One-sided',
    capitalization: 'Capitalization'
  },
  changeRisk: 'Will the risk arrangement change as the model progresses?',
  workCoordination:
    'Will the participants coordinate the work of others (e.g. conveners)?',
  gainsharing: 'Will there be gainsharing payments?',
  collectIDs: 'Will you collect participant IDs?',
  overlap: 'Will the providers overlap with other models?',
  overlapOptions: {
    yes: 'Yes, we expect to develop policies to manage the overlaps',
    yesNoIssue: 'Yes, and the overlaps would not be an issue'
  },
  trackPayments: 'Will you track gainsharing payments?',
  collectTINs: 'Will you collect TINs, NPIs, CCNs? Selct all that apply.',
  collectTINsInfo:
    'Note: If this will be a MIPS or Advanced APM, you need to collect provider TIN-NPIs for participants to benefit from QQP. In addition, CPI vetting needs to be performed.',
  collectTINsOptions: {
    tins: 'TINs',
    npis: 'NPIs',
    ccns: 'CCNs',
    no: 'No, we will not collect provider identifiers'
  }
};

export default participantsAndProviders;
