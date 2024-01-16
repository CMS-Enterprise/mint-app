const crtdl = {
  heading: 'CR and TDLs',
  subheading: 'for <1>{{modelName}}</1>',
  breadcrumb: 'Model Plan task list',
  breadcrumb2: 'CRs and TDLs',
  description:
    'Add, manage, and update any known Change Requests (CRs) and Technical Direction Letters (TDLs) associated with your model. More information about each CR or TDL can be found in Enterprise Electronic Change Information Management Portal (ECHIMP). If you need access to ECHIMP, please contact the MINT Team at ',
  emailContact: 'MINTTeam@cms.hhs.gov.',
  readOnlyDescription:
    'More information about each Change Request (CR) or Technical Direction Letter (TDL) can be found in Enterprise Electronic Change Information Management Portal (ECHIMP). If you need access to ECHIMP, please contact the MINT Team at ',
  crButton: 'Change Request (CR)',
  tdlButton: 'Technical Direction Letter (TDL)',
  addCRTDL: 'Add a CR or TDL',
  updateCRTDL: 'Update a CR or TDL',
  addRedirect: 'Don’t add a CR or TDL and return to previous page',
  updateRedirect: 'Don’t update CR or TDL and return to previous page',
  createDescription:
    'Add any known Change Requests (CRs) and Technical Direction Letters (TDLs) associated with your model.',
  updateDescription:
    'Update this Change Request (CR) or Technical Direction Letters (TDL) that is associated with your model.',
  crtdlsTable: {
    idNumber: 'ID number',
    date: 'Date initiatied',
    dateImplemented: 'Date implemented',
    title: 'CR or TDL title',
    notes: 'Notes',
    noCRTDLs: 'No CRs or TDLs',
    actions: 'Actions',
    edit: 'Edit',
    remove: 'Remove',
    error: {
      heading: 'There is a problem',
      body: 'Failed to fetch Model Plan CRs and TDLs'
    }
  },
  editCRTDL: {
    sucess: 'Success! {{-crtdl}} has been updated.',
    fail: 'Failed to update {{-crtdl}}.'
  },
  submitError: {
    heading: 'There is a problem',
    body:
      'Something went wrong with MINT. Please try refreshing the page or try again later.'
  },
  removeCRTDLModal: {
    header: 'Confirm you want to remove {{-crtdl}}.',
    warning:
      'This will no longer display on the Model Plan after it is removed.',
    confirm: 'Remove it',
    cancel: 'Keep it',
    removeCRTDLFail: 'Failed to remove {{-crtdl}}',
    removeCRTDLSuccess: 'Success! {{-crtdl}} removed from {{-modelName}}'
  },
  successAdd: 'Success! {{-crtdl}} added to {{-modelName}}',
  successUpdate: 'Success! {{-crtdl}} updated on {{-modelName}}',
  idNumber: 'ID number',
  idNumberInfo: 'Ex. TDL-123456',
  dateInitiated: 'Date initiated',
  dateImplemented: 'Implementation date',
  dateMonth: 'Month',
  dateYear: 'Year',
  dateSelect: '- Select -',
  dateMonths: [
    '01- January',
    '02 - February',
    '03 - March',
    '04 - April',
    '05 - May',
    '06 - June',
    '07 - July',
    '08 - August',
    '09 - September',
    '10 - October',
    '11 - November',
    '12 - December'
  ],
  dateImplementedInfo: 'For example: April 2024',
  title: 'CR or TDL title',
  notes: 'Optional notes',
  notesInfo:
    'Add any details about this CR or TDL that would be helpful to know at a glance',
  validDate: 'Please use a valid date format',
  error: 'There was an error loading CR and TDL data.',
  errorInfo: 'Please try loading the page again.',
  required1: 'All fields marked with ',
  required2: ' are required.'
};

export default crtdl;
