import { TranslationDocuments } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const documents: TranslationDocuments = {
  fileName: {
    gqlField: 'fileName',
    goField: 'FileName',
    dbField: 'file_name',
    label: 'File Name',
    sublabel: 'Enter a Name for your document.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  isLink: {
    gqlField: 'isLink',
    goField: 'IsLink',
    dbField: 'is_link',
    label: 'Is this a link to a document?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.02,
    options: {
      true: 'Link to document',
      false: 'Upload document'
    }
  },
  url: {
    gqlField: 'url',
    goField: 'url',
    dbField: 'url',
    label: 'Link',
    sublabel:
      'Paste the link for your document. Make sure it includes http:// or https://.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.03
  },
  fileType: {
    gqlField: 'fileType',
    goField: 'FileType',
    dbField: 'file_type',
    label: 'File Type',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.04
  },
  documentType: {
    gqlField: 'documentType',
    goField: 'documentType',
    dbField: 'document_type',
    label: 'What type of document are you uploading?',
    exportLabel: 'Document type',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    order: 1.05,
    options: {
      CONCEPT_PAPER: 'Concept Paper',
      DESIGN_PARAMETERS_MEMO: 'Design Parameter Memo',
      ICIP_DRAFT: 'ICIP Draft',
      MARKET_RESEARCH: 'Market Research',
      OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION:
        'Office of the Administrator Presentation',
      POLICY_PAPER: 'Policy Paper',
      OTHER: 'Other'
    }
  },
  otherType: {
    gqlField: 'otherType',
    goField: 'OtherType',
    dbField: 'other_type',
    label: 'What kind of document is this?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.06
  },
  restricted: {
    gqlField: 'restricted',
    goField: 'restricted',
    dbField: 'restricted',
    label: 'Does this document contain cost information?',
    sublabel:
      'Cost information would include any content relating to budget, funding, cost, or other monetary considerations.',
    exportLabel: 'Visibility',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.07,
    options: {
      true: 'Yes',
      false: 'No'
    },
    exportOptions: {
      true: 'Restricted',
      false: 'All'
    }
  },
  optionalNotes: {
    gqlField: 'optionalNotes',
    goField: 'OptionalNotes',
    dbField: 'optional_notes',
    label: 'Optional notes about the document',
    exportLabel: 'Notes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.08
  }
};

export const documentsMisc = {
  heading: 'Documents',
  subheading: 'for <1>{{modelName}}</1>',
  breadcrumb: 'Model Plan task list',
  breadcrumb2: 'Upload Document',
  itTracker: 'Operational solutions tracker',
  solutionDetails: 'Solution details',
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
    visit: 'Visit',
    remove: 'Remove',
    error: {
      heading: 'There is a problem',
      body: 'Failed to fetch Model Plan documents'
    }
  },
  requiredHint: 'Fields marked with an asterisk (',
  requiredHint2: ') are required.',
  fileTypes: 'Select a PDF, DOC, DOCX, XLS, or XLSX',
  uploadError: {
    heading: 'There is a problem',
    body: 'Something went wrong with MINT. Please try refreshing the page or try again later.'
  },
  removeDocumentModal: {
    header: 'Confirm you want to remove {{-documentName}}.',
    warning:
      'You will not be able to access this document after it is removed.',
    warning2:
      'You will not be able to access this document after it is removed. It will also be removed from any linked solutions within the operational solutions tracker.',
    warningRemoveSolution:
      ' this document will delete it from your model completely, and you will no longer be able to access it. It will also be removed from any other linked solutions.',
    warningRemoveSolution2:
      ' this document will delete it from your model completely, and you will no longer be able to access it.',
    warningDisconnectSolution:
      ' this document will remove it only from this solution. It will still be available with the rest of your model documents.',
    linkDocsWarning:
      'This document is connected to {{-numLinkedSolutions}} solution{{-plural}}.',
    linkDocsWarning2:
      'This document is connected to {{-numLinkedSolutions}} other solution{{-plural}}.',
    removing: 'Removing',
    disconnecting: 'Disconnecting',
    confirm: 'Remove document',
    confirmSolutionRemove: 'Remove',
    disconnect: 'Disconnect',
    keepDocument: 'Keep document',
    cancel: 'Cancel',
    confirmationText_name:
      'The document for {{-documentName}} has been removed',
    confirmationText_noName: 'The document has been removed'
  },
  downloadFail: 'Failed to download file',
  urlFail: 'Failed to fetch file URL',
  documentUploadSuccess: 'Success! {{-documentName}} added to {{-modelName}}.',

  segmentedButton: {
    upload: 'Upload document',
    link: 'Link to document'
  },
  addDocument: 'Add a document',
  uploadDescription:
    'Choose to upload or link to a document, such as a recent concept document, policy paper, or any additional model background information.',
  documentUpload: 'Document upload',
  selectedFile: 'Selected file',
  changeFile: 'Change file',
  ariaLabelChangeFile: '-- Click to change file',
  fileSelected: 'File <1>{{file}}</1> selected.',
  dragFile: 'Drag file here or ',
  linkDocument: {
    linkLabel: 'Link',
    linkHelpText:
      'Paste the link for your document. Make sure it includes http:// or https://.',
    fileNameLabel: 'File name',
    fileNameHelpText: 'Enter a name for your document.'
  },
  chooseFromFolder: 'choose from folder',
  notValid: 'This is not a valid file type.',
  whatType: 'What type of document are you uploading?',
  documentTypes: {
    concept: 'Concept Paper',
    designParamMemo: 'Design Parameter Memo',
    policy: 'Policy Paper',
    icipDraft: 'ICIP Draft',
    marketResearch: 'Market Research',
    adminOfficePresentation: 'Office of the Administrator Presentation',
    other: 'Other'
  },
  whatKind: 'What kind of document is this?',
  optionalNotes: 'Optional notes about the document',
  safetyScan:
    'To keep CMS safe, documents are scanned for viruses after uploading. If something goes wrong, we’ll let you know',
  submitButton: 'Add document',
  dontAdd: 'Don’t add and return to previous page',
  selectFile: 'Select file',
  documentKind: 'What kind of document is this?',
  restricted: 'Restricted',
  all: 'All',
  costQuestion: 'Does this document contain cost information?',
  costInfo:
    'Cost information would include any content relating to budget, funding, cost, or other monetary considerations.',
  costWarningAll: 'This document will be visible to all MINT users.',
  costWarningAssessment:
    'This document will only be visible to the model team and MINT Team.',
  validation: {
    file: 'Choose a document to upload.',
    url: 'Make sure link includes http:// or https://.',
    link: 'Please enter the link for your document',
    documentType: 'Select the type of document you are uploading.',
    restricted: 'Please select if this document contains cost information.',
    otherDescr: 'Enter a document name.'
  },
  connectDocumentsHeader: 'Connect existing documents',
  connectDocumentsInfo:
    'Connect any model documents previously added that are associated with this solution.',
  connectDocumentsButton: 'Connect documents',
  dontConnect: 'Don’t connect documents and return to solution details',
  documentLinkSuccess: 'Success! Your documents are linked to this solution.',
  documentDisconnect: {
    success:
      'Success! {{documentName}} has been disconnected from this solution.',
    error:
      'There was an error disconnecting {{documentName}}. Please try again.'
  },
  documentRemoval: {
    success: 'Success! {{documentName}} removed from {{modelName}}.',
    error: 'There was an error removing {{documentName}}. Please try again.'
  },
  documentLinkError:
    'There was an error connecting {{fileName}} to this solution. Please try again.',
  documentUnLinkError:
    'There was a problem unlinking the selected model documents to this solution. Please try again.',
  documentUploadSolutionSuccess:
    'Success! {{-documentName}} has been added to this solution.',
  noLinkedDocs: 'No documents associated with this solution yet'
};

export default documents;
