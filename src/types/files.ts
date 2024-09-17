import { DocumentType } from 'gql/generated/graphql';

export type FileUploadForm = {
  file: File | null;
  filename?: string;
  uploadURL?: string;
  restricted: boolean | null;
  documentType: DocumentType | null;
  otherTypeDescription: string;
  optionalNotes: string;
};

export type LinkingDocumentFormTypes = {
  name: string;
  url: string;
  restricted: boolean | null;
  documentType: DocumentType | null;
  otherTypeDescription: string;
  optionalNotes: string;
};

export type UploadedFile = {
  filename: string;
  uploadURL: string;
  downloadURL: string;
};

// Redux store type for file upload state
export type FileUploadState = {
  form: FileUploadForm;
  files: UploadedFile[];
  downloadTarget: string;
  isLoading: boolean | null;
  isSaving: boolean;
  error: any;
  isUploaded: boolean;
};
