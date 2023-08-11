const operationsEvaluationAndLearning = {
  heading: 'Operations, evaluation, and learning',
  operationsEvaluationAndLearningHeading:
    'Review operations, evaluation, and learning',
  breadcrumb: 'Operations, evaluation, and learning',
  anotherAgency:
    'Will another Agency or State help design/operate the model? Select all that apply.',
  anotherAgencyOptions: {
    withState: 'Yes, we will partner with states',
    getIdeas: 'Yes, we will get ideas from another agency',
    getSupport:
      'Yes, we will get support from another agency through Inter Agency Agreement (IAA)',
    no: 'No',
    other: 'Other'
  },
  creatingDependencies:
    'Are you anticipating creating dependencies between services?',
  creatingDependenciesInfo:
    'Examples: Service B cannot be paid until Service A has been paid; Service A cannot be paid without Diagnosis 1; If a certain service or diagnosis exists in history, then Service A cannot be paid.',
  stakeholders: 'What stakeholders do you plan to communicate with?',
  stakeholdersOptions: {
    beneficiaries: 'Beneficiaries',
    communityOrganizations: 'Community organizations',
    participants: 'Participants',
    professionalOrganizations: 'Professional organizations',
    providers: 'Providers',
    states: 'States',
    other: 'Other'
  },
  selectedStakeholders: 'Selected stakeholders',
  pleaseDescribe:
    'Please describe the other stakeholders you plan to communicate with.',
  helpDesk: 'Do you plan to use a helpdesk?',
  helpDeskOptions: {
    cbosc: 'Through OBOSC',
    contractor: 'Through a contractor',
    other: 'Other',
    no: 'No'
  },
  iddocSupport: 'Are you planning to use IDDOC support?',
  iddocSupportInfo:
    'IDDOC is commonly known as ACO-OS (Accountable Care Organization Operating System). They can provide support for design, development, operations, and maintenance.',
  iddocSupportInfo2:
    'If you select yes, there will be additional questions to answer.',
  whatContractors: 'What contractors will support your model?',
  whatContractorsOptions: {
    one: 'One contractor to support implementation',
    separate:
      'May have separate contractors for different implementation functions',
    noContractor: 'Do not plan to use an implemenation contractor',
    other: 'Other'
  },
  whatContractorsHow: 'In what capacity will they support your model?',
  whatContractorsHowInfo: '(implementation, data analysis, quality, etc.)',
  paymentContractor: 'Is a payment contractor required?',
  paymentContractorInfo:
    'Note: If there will be 30+ payees we recomment a contractor.',
  thirdPartyContractor:
    'Will you use a contractor other than the Shared Systems to collect or analyze data from the model? (Third Party Contractor)',
  contractorSelected:
    'Has this contractor been selected, and available to participate in the technical design and development model?',
  providingData:
    'Will the contractorbe providing data (a Third Party File) that will be used in claims processing?',
  bdc:
    'Is the contractor connected to the Balitmore Data Center (BDC) and are they aware of the Electronic Files Transfer process needed?',
  testData:
    'Is the contractor aware that test data will be needed, and when that test data must be available?',
  acoSupport: 'Are you planning to use ASO-OS support?',
  acoQuestions: 'ACO-OS operations specific questions',
  acoOperations: 'What operations will ACO-OS support?',
  acoOperationsOptions: {
    os: 'ACO-OS',
    ui: 'ACO-IO',
    innovation: '4innovation (4i)'
  },
  iddocHeading: 'IDDOC operations questions',
  icdHeading: 'Interface Control Document (ICD) questions',
  icdSubheading:
    'An interface control document provides a record of all interface information generated for a project.',
  technicalContacts: 'Are technical contacts identified?',
  participantInformation: 'Will you capture participant information?',
  participantInformationInfo:
    'This means the participant record for a model would be included in the ACO-OS Entity File.',
  interfaceControl: 'ACO-OS interface control questions',
  icdOwner: 'ICD owner',
  draftIDC: 'Draft ICD required by',
  validDate: 'Please use a valid date format',
  testingQuestions: 'Testing questions',
  ssmRequest:
    'SSM request to begin analysis at least 1 year before implementation',
  uatNeeds: 'User Acceptance Testing (UAT) – test data needs',
  stcNeeds: 'STC – test data needs',
  testingTimelines: 'Define the testing timelines',
  dataMonitoring: 'Data monitoring questions',
  dataMonitoringContinued: 'Data monitoring questions continued',
  fileTypes: 'What types of files? Select all that apply.',
  fileTypesOptions: {
    beneficiary: 'Beneficiary',
    provider: 'Provider',
    partA: 'Part A',
    partB: 'Part B',
    other: 'Other'
  },
  responseTypes: 'What types of responses?',
  fileFrequency: 'Frequency of files?',
  timeFrequency: 'Full time or incremental?',
  fullTime: 'Full time',
  incremental: 'Incremental',
  eftAndConnectivity:
    'Are Electronic File Transfer (EFT) and connectivity set up?',
  adjustments: 'Will unsolicited adjustments be included?',
  diagrams: 'Are data flow diagrams needed?',
  benefitEnhancement: 'Will you produce Benefit Enhancement Files?',
  benefitEnhancementInfo:
    'This means we would use these files for Participating and Preferred Providers.',
  namingConventions: 'File naming conventions',
  establishBenchmark: 'Will you establish a benchmark to capture performance?',
  establishBenchmarkOptions: {
    reconcile: 'Yes, and we will reconcile actual performance against it',
    notReconcile:
      'Yes, but we will not reconcile actual performance against it',
    no: 'No'
  },
  computeScores: 'Will you compute performance scores?',
  riskAdjustments: 'Will you make risk adjustments to the following?',
  performanceScores: 'Performance Scores',
  feedbackResults: 'Feedback Results',
  payments: 'Payments',
  others: 'Others',
  scoreCalculation:
    'Will risk scores be calculated to adjust performance scores and/or calculate payments?',
  provideSpecifics:
    'Could you provide specific information regarding the statistical methodology for risk adjustment or target prices?',
  provideSpecificsInfo: {
    forExample: 'For example:',
    num1: '1. Definition of the techniques used (OLS, MLE, etc..)',
    num2:
      'Covariate lists from regression mapped to English description of these factors',
    num3: 'Definition of cohort of providers used for rate setting',
    num4:
      'Timing of forecasts and rate offering relative to when underlying FFS rates are set.',
    num5:
      'Description of credibility, smoothing, or blending adjustments made to rating cells'
  },
  participantAppeal: 'Will participants be able to appeal the following?',
  evaluationApproach:
    'What type of evaluation approach are you considering? Select all that apply.',
  approachOptions: {
    establish: 'Establish control and intervention groups',
    identify: 'Identify a comparison/match group',
    interrupted: 'Interrupted time series',
    leverage:
      'Leverage non-Medicare data (such as Medicaid data, external data sets)',
    other: 'Other'
  },
  evaluationOther:
    'Please describe the other evaluation approach you are considering.',
  dataNeeded:
    'What data do you need to monitor the model? Select all that apply.',
  dataNeededInfo:
    'If you select quality claims-based measures or quality reported measures, there will be additional questions to answer.',
  dataNeededOptions: {
    siteVisits: 'Site visits',
    medicareClaims: 'Medicare claims',
    medicaidClaims: 'Medicaid claims',
    encounterData: 'Encounter data',
    noPayClaims: 'No pay claims',
    qualityClaims: 'Quality claims-based measures',
    qualityReported: 'Quality reported measures',
    clinicalData: 'Clinical data',
    nonClinical: 'Non-clinical data (e.g., surveys)',
    nonMedical: 'Non-medical data (e.g., housing, nutrition)',
    other: 'Other',
    notPlanningToCollect: 'Not planning to collect data'
  },
  selectedData: 'Selected data',
  dataNeededOther: 'What other data do you need to monitor?',
  validatedQuality:
    'Do you plan to develop a new validated quality measure for your model?',
  impactPayment: 'Does quality performance impact payment?',
  addtionalData: 'Will any additional data need to be collected?',
  additionalDataInfo:
    'Note: If you are not sure what current data is collected via provider billing, please ask Provider Billing Group (PBG)',
  dataToSend: 'What data will you send to participants? Select all that apply.',
  dataToSendOther: 'What other data do you need to send?',
  dataToSendOptions: {
    baseline: 'Baseline/historical data',
    claims: 'Claims-level data',
    beneficiary: 'Beneficiary-level data',
    participant: 'Participant-level data',
    provider: 'Provider-level data',
    other: 'Other',
    notPlanning: 'Not planning to send data'
  },
  claimLineFeed:
    'Does the model require that identifiable Claim and Claim Line Feed (CCLFs) data need to be shared with participants?',
  reportingTiming: 'Data sharing timing and frequency',
  dataSharing: 'Data sharing starts',
  dataSharingInfo:
    'If using ACO-OS support, SSM request to begin analysis at least 1 year before implementation',
  dataSharingOptions: {
    during: 'During application period',
    shortlyBefore: 'Shortly before the start date',
    early: 'Early in the first performance year',
    later: 'Later in the first performance year',
    subsequent: 'In the subsequent performance year',
    somePoint: 'At some other point in time',
    notPlanning: 'Not planning to do this',
    other: 'Other'
  },
  dataSharingHowOften: 'How often do you anticipate sharing data?',
  dataSharingHowOftenSeleted: 'Data sharing frequency',
  dataSharingHowOftenOptions: {
    annually: 'Annually',
    bianually: 'Semiannually',
    quarterly: 'Quarterly',
    monthly: 'Monthly',
    semiMonthly: 'Semi-monthly',
    weekly: 'Weekly',
    daily: 'Daily',
    other: 'Other',
    notPlanning: 'Not planning to do this'
  },
  dataCollectionTiming: 'Data collection timing and frequency',
  dataCollection: 'Data collection starts',
  dataCollectionHowOften: 'How often do you anticipate collecting data?',
  dataReporting: 'Quality reporting starts',
  reportingFrequency:
    'What is the frequency of reporting either to you or from participants under the model?',
  ccw: 'Is Chronic Conditions Warehouse (CCW) involved in the model?',
  ccwInfo:
    'If you select either yes option, there will be additional questions to answer.',
  ccwOptions: {
    yesEval: 'Yes, for evaluation',
    yesImpl: 'Yes, for implementation',
    no: 'No',
    other: 'Other'
  },
  ccwSpecific: 'Chronic Conditions Warehouse (CCW) questions',
  ccwSendFiles:
    'Will you need to send files between the CCW and other applications?',
  fileTransfers:
    'Do you know which applications will be on the other sides of the file transfers?',
  distributeFiles:
    'Will you use the CCW to distribute files to and from model participants?',
  qualityQuestions: 'Quality questions',
  includedPayment:
    'Data sources included payment (FFS A,B,D claims... Standardized payment tables...)',
  learningSystem: 'Will the model have a learning strategy?',
  learningSystemOptions: {
    connector:
      'We plan to have a learning contractor (cross-model or individual)',
    itConnect: 'We plan to use an IT platform (Connect)',
    collaboration: 'We plan to enable participant-to-participant collaboration',
    educate: 'We plan to educate beneficiaries',
    other: 'Other',
    no: 'No, we will not have a learning strategy'
  },
  obstacles:
    'What challenges do you anticipate during Model design and implementation?',
  obstaclesInfo:
    'Please list and known ’unknowns,’ that is, are there policy decisions that you are aware of that are still pending or are subject to change? If so, please list to the best of your ability.',
  identifyAlternative: 'Identify and alternative iterations of the model.',
  episodeInitiation: 'Episode initiation and termination criteria',
  episodeInitiationInfo:
    '(In ZZZZ this was the receipt of chemo and specific diagnostic codes)',
  appealsWarning:
    'If yes to any of the following, please check with the Legal Vertical on what needs to be in a Participation Agreement and/or regulatory text around your model’s appeal process steps and time frames.'
};

export default operationsEvaluationAndLearning;
