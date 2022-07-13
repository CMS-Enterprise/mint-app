const itTools = {
  heading: 'IT tools',
  breadcrumb: 'IT tools',
  subheading:
    'This section allows you to choose which IT solutions the model will utilize. Many questions are populated based on responses to questions in the previous sections of the task list. If you need help, ask a question using the link below.',
  summaryBox: {
    heading: 'Why do I need to answer this?',
    previouslyAnswered: 'You previously answered:',
    havenNotAnswered: 'You haven’t answered:',
    changeAnswer: 'Want to change your answer?',
    goToQuestion: 'Go to question'
  },
  tools: 'Tools',
  changeAnswer:
    'If you change your answer to include either of the following options, you can select tools from the list below.',
  partCDTypes: {
    marx: 'Medicare Advantage Prescription Drug System (MARx)',
    other: 'Other'
  },
  collectBidsTypes: {
    hpms: 'Health Plan Management System (HPMS)',
    other: 'Other'
  },
  updateContractTypes: {
    hpms: 'Health Plan Management System (HPMS)',
    other: 'Other'
  },
  partCDTools: 'What tools will you use to manage Part C/D enrollment?',
  partCDToolsInfo: '(models that impact Medicare Advantage/Part D)',
  collectBidsTools: 'What tools will you use to review and collect plan bids?',
  updateContract: 'What tools will you use to update the plan’s contract?',
  advertiseModel: 'What tools will you use to advertise model?',
  advertiseModelInfo: '(Letter of Intent/Notice of Funding Opp.)',
  ppToAdvertiseOptions: {
    salesforce: 'Salesforce',
    grantSolutions: 'Grant Solutions',
    other: 'Other'
  },
  ppToAdvertiseInfo: 'If cooperative agreement, please select Grant Solutions.',
  collectTools:
    'What IT tools will you use to collect, review, and score applications?',
  appSupport:
    'What tools will you use to obtain an application support contractor?',
  appSupportInfo: '(work with BSG Acquisition Team for more)',
  ppCommunicateWithParticipantOptions: {
    outlook: 'Outlook Mailbox',
    govDelivery: 'GovDelivery',
    salesforce: 'Salesforce Portal',
    other: 'Other'
  },
  ppManageProviderOverlapOptions: {
    mdm: 'Master Data Management (MDM)',
    other: 'Other',
    na: 'Not applicable'
  },
  bManageBeneficiaryOverlapOptions: {
    mdm: 'Master Data Management (MDM)',
    other: 'Other',
    na: 'Not applicable'
  },
  communicateTools: 'What tools will you use to communicate with participants?',
  manageOverlap: 'What tools will you use to manage provider overlaps?',
  manageOverlapInfo:
    'This might be needed if your model has policies around provider overlaps, or if another model has policies about providers overlaps with your model.',
  beneficiaryOverlaps:
    'What tools will you use to manage beneficiary overlaps?',
  beneficiaryOverlapsInfo:
    'This might be needed if your model has policies around beneficiary overlaps, or if another model has policies about beneficiaries overlaps with your model.',
  oelHelpdeskSupportOptions: {
    cbosc: 'Consolidated Business Operations Support Center (CBOSC)',
    contractor: 'Through a contractor',
    other: 'Other'
  },
  oelManageAcoOptions: {
    acoOS: 'Accountable Care Organization Operating System (ACO-OS)',
    acoOSInfo: 'supports design, development, and operations and maintenance',
    acoUI: 'Accountable Care Organization User Interface (ACO-UI)',
    innovation: '4innovation (4i)',
    other: 'Other'
  },
  oelManageAcoSubinfoOptions: {
    acoOS: 'supports design, development, and operations and maintenance',
    acoUI: 'supports operations and maintenance',
    innovation:
      'supports design, development, operations and maintenance in cloud environments (AWS)',
    other: ''
  },
  oelPerformanceBenchmarkOptions: {
    idr: 'Integrated Data Repository (IDR)',
    ccw: 'Chronic Conditions Warehouse (CCW)',
    other: 'Other'
  },
  helpDeskTools: 'What tools will you use for helpdesk support?',
  iddocTools: 'Which IDDOC tools will you use?',
  benchmarkTools:
    'What tools will you use to establish a benchmark with participants?',
  participantAppeal: 'Participants will be able to appeal the following',
  appealTools: 'What tools will you use to process appeals from participants?',
  appealToolsInfo:
    'If you are using different tools for different use cases, please explain by adding a note or by checking Other and explaining further.',
  oelProcessAppealsOptions: {
    medicare: 'Medicare Appeal System',
    other: 'Other'
  },
  oelEvaluationContractorOptions: {
    rmda: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
    other: 'Other'
  },
  oelCollectDataOptions: {
    idr: 'Integrated Data Repository (IDR)',
    ccw: 'Chronic Conditions Warehouse (CCW)',
    idos: 'Innovation Development and Operation Services (IDOS)',
    isp: 'Innovation Support Platform (ISP)',
    contractor: 'Another contractor',
    other: 'Other'
  },
  appealsNeedsAnswer:
    'If your answer includes “Yes” for any type of appeal, you can select tools from the list below.',
  contractorTool: 'How will you acquire an evaluation contractor?',
  monitorTools: 'What tools will you use to get data to monitor the model?',
  monitorNeedsAnswer:
    'If your answer is any option except not planning to collect data, you will need to select tools from the list below.',
  oelObtainDataOptions: {
    ccw: 'Chronic Conditions Warehouse (CCW)',
    idos: 'Innovation Development and Operation Services (IDOS)',
    isp: 'Innovation Support Platform (ISP)',
    other: 'Other'
  },
  oelClaimsBasedMeasuresOptions: {
    idr: 'Integrated Data Repository (IDR)',
    ccw: 'Chronic Conditions Warehouse (CCW)',
    other: 'Other'
  },
  oelQualityScoresOptions: {
    existing: 'Existing CMS data and process',
    new: 'Health Data Reporting (new CMMI process)',
    other: 'Other new process',
    none: 'None'
  },
  supportTools: 'What tools will you use for data to support model evaluation?',
  claimsBasedTools: 'What tools will you use for claims-based measures?',
  claimsNeedsAnswer:
    'If your answer includes “Quality claims-based measures”, you can select tools from the list below.',
  qualityTools:
    'What tools will you use for scores related to quality performance, if any?',
  qualityNeedsAnswer:
    'If you change your answer to quality reported measures, you will need to select tools from the list below.',
  oelSendReportsOptions: {
    idos: 'Innovation Development and Operation Services (IDOS)',
    rmda: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
    internal: 'Internal staff',
    other: 'Other'
  },
  oelLearningContractorOptions: {
    rmda: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
    crossModel: 'A cross-model contract',
    other: 'Other'
  },
  oelParticipantCollaborationOptions: {
    connect: 'Connect (a Salesforce tool)',
    other: 'Other'
  },
  sendReportTools:
    'What tools will you use to send reports/data to participants?',
  sendDataNeedsAnswer:
    'If your answer is any option except not planning to send data, you will need to select tools from the list below.',
  learningNeedsAnswer:
    'If you change your answer to include “We plan to have a learning contractor”, you can select tools from the list below.',
  participantNeedsAnswer:
    'If you change your answer to include “We plan to enable participant-to-participant collaboration”, you can select tools from the list below.',
  yesNeedsAnswer:
    'If you change your answer to “Yes”, you can select tools from the list below.',
  eitherYesNeedsAnswer:
    'If your answer is either yes option, you will need to select tools from the list below.',
  loiNeedsAnswer:
    'If your answer is “LOI” or “NOFO”, you can select tools from the list below.',
  scoringToolNeedsAnswer:
    'If your answer includes “Use an application review and scoring tool”, you can select tools from the list below.',
  contractorNeedsAnswer:
    'If your answer includes “Get an application support contractor”, you can select tools from the list below.',
  oelEducateBeneficiariesOptions: {
    oc: 'Office of Communications (OC)',
    other: 'Other'
  },
  pMakeClaimsPaymentsOptions: {
    sharedSystems: 'Shared Systems',
    higlas: 'Healthcare Integrated General Ledger Accounting System (HIGLAS)',
    other: 'Other'
  },
  pInformFfsOptions: {
    ffsCompetencyCenter: 'FFS Competency Center',
    other: 'Other'
  },
  educateTools: 'What tool will you use to educate beneficiaries?',
  educateBeneficiariesNeedsAnswer:
    'If your answer includes “We plan to educate beneficiaries”, you can select tools from the list below.',
  ffsTools:
    'What tools will you use to adjust how Fee-for-Service (FFS) claims are paid?',
  ffsNeedsAnswer:
    'If your answer includes “Claims-based payments”, you can select tools from the list below.',
  waiveParticipantsTools:
    'What tools will you use to inform Fee-for-Service (FFS) about participants who should be waived from a rule?',
  yesFFSNeedsAnswer:
    'If your answer is yes, you will need to select tools from the list below.'
};

export default itTools;
