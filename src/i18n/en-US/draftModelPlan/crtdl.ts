const crtdl = {
  heading: 'CR and TDLs',
  subheading: 'for <1>{{modelName}}</1>',
  breadcrumb: 'Model Plan task list',
  breadcrumb2: 'CRs and TDLs',
  description:
    'Add, manage, and update any known Change Requests (CRs) and Technical Direction Letters (TDLs) associated with your model. More information about each CR or TDL can be found in Enterprise Electronic Change Information Management Portal (ECHIMP). If you need access to ECHIMP, please contact the Model Assessment team at ',
  emailContact: '[email]@cms.hhs.gov.',
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
  idNumber: 'ID number',
  idNumberInfo: 'Ex. TDL-123456',
  dateInitiated: 'Date initiated',
  title: 'CR or TDL title',
  notes: 'Optional notes',
  notesInfo:
    'Add any details about this CR or TDL that would be helpful to know at a glance',
  validDate: 'Please use a valid date format',
  error: 'There was an error loading CR and TDL data.',
  errorInfo: 'Please try loading the page again.'
};

export default crtdl;
