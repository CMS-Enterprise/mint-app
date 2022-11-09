const documents = {
  heading: 'Documents',
  subheading: 'for <1>{{modelName}}</1>',
  breadcrumb: 'Model Plan task list',
  breadcrumb2: 'Upload Document',
  description:
    'Upload any documents relevant to your Model Plan.  This could include recent concept documents, policy papers, or any additional model background information.',
  addADocument: 'Add a document',
  documentTable: {
    name: 'File Name',
    type: 'Document Type',
    notes: 'Notes',
    uploadDate: 'Upload date',
    actions: 'Actions',
    noDocuments: 'No documents uploaded',
    visibility: 'Visibility',
    scanInProgress: 'Virus scan in progress...',
    noVirusFound: 'No viruses found',
    virusFound: 'Virus found',
    view: 'View',
    remove: 'Remove',
    error: {
      heading: 'There is a problem',
      body: 'Failed to fetch Model Plan documents'
    }
  },
  uploadError: {
    heading: 'There is a problem',
    body:
      'Something went wrong with MINT. Please try refreshing the page or try again later.'
  },
  removeDocumentModal: {
    header: 'Confirm you want to remove {{-documentName}}.',
    warning:
      'You will not be able to access this document after it is removed.',
    confirm: 'Remove document',
    cancel: 'Keep document',
    confirmationText_name:
      'The document for {{-documentName}} has been removed',
    confirmationText_noName: 'The document has been removed'
  },
  downloadFail: 'Failed to download file',
  urlFail: 'Failed to fetch file URL',
  removeDocumentFail: 'Failed to remove document {{-documentName}}',
  removeDocumentSuccess: 'Success! Document {{-documentName}} removed.',
  documentUploadSuccess: 'Successfully added {{-documentName}}.',
  uploadDocument: 'Upload a document',
  uploadDescription:
    'Choose a document to upload, such as a recent concept document, policy paper, or any additional model background information.',
  documentUpload: 'Document upload',
  selectedFile: 'Selected file',
  changeFile: 'Change file',
  fileSelected: 'File <1>{{file}}</1> selected.',
  dragFile: 'Drag file here or ',
  chooseFromFolder: 'choose from folder',
  notValid: 'This is not a valid file type.',
  whatType: 'What type of document are you uploading?',
  documentTypes: {
    concept: 'Concept Paper',
    policy: 'Policy Paper',
    icipDraft: 'ICIP Draft',
    marketResearch: 'Market Research',
    other: 'Other'
  },
  whatKind: 'What kind of document is this?',
  optionalNotes: 'Optional notes about the document',
  safetyScan:
    'To keep CMS safe, documents are scanned for viruses after uploading. If something goes wrong, we’ll let you know',
  uploadButton: 'Upload document',
  dontUpload: 'Don’t upload and return to previous page',
  selectFile: 'Select file',
  documentKind: 'What kind of document is this?',
  restricted: 'Restricted',
  all: 'All',
  costQuestion: 'Does this document contain cost information?',
  costInfo:
    'Cost information would include any content relating to budget, funding, cost, or other monetary considerations.',
  costWarningAll: 'This document will be visible to all MINT users.',
  costWarningAssessment:
    'This document will only be visible to the model team and BSG Assessment Team.',
  validation: {
    file: 'Choose a document to upload.',
    documentType: 'Select the type of document you are uploading.',
    restricted: 'Please select if this document contains cost information.',
    otherDescr: 'Enter a document name.'
  }
};

export default documents;
