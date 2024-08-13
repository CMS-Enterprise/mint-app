const generalReadOnly = {
  back: 'View all models',
  description: {
    more: 'Read more',
    less: 'Read less'
  },
  showSummary: 'Show model summary',
  hideSummary: 'Hide model summary',
  status: 'Status',
  updateStatus: 'Update this Model Plan',
  lastUpdate: 'Last updated on ',
  createdOn: 'Created on ',
  alert:
    'Information outlined in this Model Plan can change drastically until it’s been cleared.',
  contactInfo: {
    modelLeads: 'Model lead(s)',
    payment: 'Payment',
    emptyStatePayment:
      'Not assigned - speak with Model lead(s) for payment-related questions',
    emptyStateCMFFS:
      'Not assigned - speak with Model lead(s) for CM FFS counterpart-related questions',
    sendAnEmail: 'Send an email',
    moreTeamMembers: 'More team members',
    cmFFS: 'CM FFS counterpart'
  },
  shareExport: 'Share or export',
  shareExportLink: 'Share or export this model plan',
  modal: {
    share: 'Share',
    sharePlan: 'Share this Model Plan with others',
    shareModel: 'Share this model',
    exportModel: 'Export this model',
    removeModel: 'Remove this model from MINT',
    shareDescription:
      'This will email a link to view this Model Plan within MINT.',
    shareInfo:
      'Generally, you should only send Model Plans to employees at CMS. If the person you’re sending this to doesn’t have access to MINT, they will need to request access to view this information. ',
    shareSelectInfo: 'Select which information you want to share.',
    shareEmail: 'Select the recipients',
    shareLabel: 'Recipients',
    shareEmailInfo:
      'Start typing the person’s name you want to share this information with',
    shareOptional: 'Optional message to include in the email',
    shareSuccess:
      'Success! This Model Plan has been emailed to the specified recipients.',
    shareError:
      'There was an error emailing this Model Plan to the specified recipients.',
    shareAlert:
      'At least one selected individual is external to the CMS organization. Please be sure they should see the information you’re sharing before proceeding.',
    copyLinkReadView: 'Copy link to Read View',
    copyLinkFilteredReadView: 'Copy link to filtered Read View',
    cancel: 'Cancel',
    export: 'Export',
    exportPlan: 'Export this Model Plan',
    exportInfo:
      'This will download the selected information, so you can share it with others.',
    exportSelectInfo: 'Select which information you want to export.',
    exportSelectFormat: 'Select format(s)',
    exportFormats: {
      csv: 'CSV',
      pdf: 'PDF'
    },
    label: 'Share/export navigation',
    allModels: 'All model plan information',
    documentTitle: 'MINT Model Plan'
  },
  questionNotApplicable_one:
    'There is {{count}} additional question that is not applicable for this model based on the answers selected in the question above.',
  questionNotApplicable_other:
    'There are {{count}} additional questions that are not applicable for this model based on the answers selected in the question above.',
  questionNotApplicableSpecific_one:
    'There is {{count}} additional question that is not applicable for this model based on the answer selected for "{{question}}".',
  questionNotApplicableSpecific_other:
    'There are {{count}} additional questions that are not applicable for this model based on the answer selected for "{{question}}".',
  questionNotApplicableBeneficiary_one: `There is {{count}}  additional question that is not applicable for this model because beneficiary cost-sharing isn't selected as a claims-based payment type the model will pay.`,
  questionNotApplicableBeneficiary_other: `There are {{count}} additional questions that are not applicable for this model because beneficiary cost-sharing isn't selected as a claims-based payment type the model will pay.`,
  questionNotApplicableCCW_one: `There is {{count}}  additional question that is not applicable for this model based on the answer to "Is Chronic Conditions Warehouse(CCW) involved in the model?"`,
  questionNotApplicableCCW_other: `There are {{count}} additional questions that are not applicable for this model based on the answer to "Is Chronic Conditions Warehouse(CCW) involved in the model?"`,
  questionNotApplicableQuality_one: `There is {{count}}  additional question that is not applicable for this model based on the answer to "What data do you need to monitor the model?"`,
  questionNotApplicableQuality_other: `There are {{count}} additional questions that are not applicable for this model based on the answer to "What data do you need to monitor the model?"`,
  showOtherQuestions_one: 'Show other question',
  showOtherQuestions_other: 'Show other questions',
  hideOtherQuestions_one: 'Hide other question',
  hideOtherQuestions_other: 'Hide other questions'
};

export default generalReadOnly;
