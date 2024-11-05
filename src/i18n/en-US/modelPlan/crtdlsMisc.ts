const crtdlsMisc = {
  heading: 'FFS CRs and TDLs',
  subheading: 'for {{modelName}}',
  breadcrumb: 'Model Plan task list',
  breadcrumb2: 'FFS CRs and TDLs',
  crs: 'CRs',
  tdls: 'TDLs',
  description:
    "If your model makes changes to the Medicare Fee for Service (FFS) payment systems, you will do so through Change Requests (CRs) and Technical Direction Letters (TDLs) in the <el>Enterprise Electronic Change Information Management Portal (ECHIMP)</el>. MINT will automatically display ECHIMP information about CRs and TDLs associated with each model. It would be best if you worked with the Center for Medicare's Provider Billing Group (PBG) to create these. Note that the CR and TDL numbers are associated with your model to support PBG, OIT, the Medicare Administrative Contractors (MACs), and Shared System Maintainers (SSMs) who implement these changes to the FFS payment systems.",
  echimp:
    'It may take up to 24 hours for CRs and TDLs to appear in MINT once added to ECHIMP.',
  echimpDisabled:
    'The FFS CR and TDL data shown here was previously entered through MINT. We’re currently switching over to pulling this information from ECHIMP directly. This work is estimated to be completed by the end of November 2024.',
  visitECHIMPReadonly: 'Visit FFS CR and TDL details in ECHIMP',
  readOnlyDescription:
    'More information about each Fee-for Service (FFS) Change Request (CR) or Technical Direction Letter (TDL) can be found in <el>Enterprise Electronic Change Information Management Portal (ECHIMP)</el>. To get access to the ECHIMP system, request the proper job code through EUA. Please contact the CMS IT Service Desk at 410-786-2580 or 800-562-1963 if you need assistance.',
  crButton: 'Change Request (CR)',
  tdlButton: 'Technical Direction Letter (TDL)',
  addCRTDL: 'Add a CR or TDL',
  addCRTDLForm: 'Add a {{-type}}',
  updateCRTDL: 'Update a CR or TDL',
  addRedirect: 'Don’t add a CR or TDL and return to previous page',
  updateRedirect: 'Don’t update CR or TDL and return to previous page',
  createDescription:
    'Add any known Fee-for Service (FFS) Change Requests (CRs) and Technical Direction Letters (TDLs) associated with your model.',
  updateDescription:
    'Update this Fee-for Service (FFS) Change Request (CR) or Technical Direction Letters (TDL) that is associated with your model.',
  crtdlsTable: {
    idNumber: 'ID number',
    date: 'Date initiatied',
    dateImplemented: 'Implementation date',
    title: 'CR or TDL title',
    notes: 'Notes',
    noCRTDLs: 'No {{-type}}s added',
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
    body: 'Something went wrong with MINT. Please try refreshing the page or try again later.'
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
  idNumberInfo: 'Please include the prefix. Ex. {{-type}}-123456',
  dateInitiated: 'Initiated date',
  dateImplemented: 'Implementation date',
  dateMonth: 'Month',
  dateYear: 'Year',
  dateSelect: '- Select -',
  dateMonths: [
    '01 - January',
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
  title: {
    cr: 'CR title',
    tdl: 'TDL title'
  },
  notes: 'Optional notes',
  notesInfo:
    'Add any details about this {{-type}} that would be helpful to know at a glance',
  validDate: 'Please use a valid date format',
  error: 'There was an error loading CR and TDL data.',
  errorInfo: 'Please try loading the page again.',
  required1: 'All fields marked with ',
  required2: ' are required.',
  tableState: {
    empty: {
      heading: 'There are no CRs or TDLs associated with this model.',
      copy: 'CRs and TDLs are associated with models in <el>ECHIMP</el>. It may take up to 24 hours for CRs and TDLs to appear in MINT once added to ECHIMP.'
    },
    noResults: {
      heading: 'We couldn\'t find any matches for "{{searchTerm}}".',
      copy: 'We couldn\'t find any matches for "FFS9999".'
    }
  },
  echimpCard: {
    sidepanelAriaLabel: 'CR and TDL Sidepanel',
    crStatus: 'CR Status',
    tdlStatus: 'TDL Status',
    crTag: {
      emergency: 'Emergency',
      sensitive: 'Sensitive/controversial',
      crQuestion: ' CR?'
    },
    implementationDate: 'Implementation Date',
    issuedDate: 'Issued date',
    viewMore: 'View more',
    viewThisInECHIMP: 'View this in ECHIMP',
    initiator: 'Initiator',
    crSummary: 'CR Summary',
    relatedCrTdl: 'Related CR/TDL number(s)'
  },
  sortBy: {
    id: 'By ID number',
    title: 'By title'
  }
};

export default crtdlsMisc;
