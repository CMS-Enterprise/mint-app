import { DocumentType } from 'types/graphql-global-types';

export type FileUploadForm = {
  file: File | null;
  filename?: string;
  uploadURL?: string;
  documentType: DocumentType | null;
  otherTypeDescription: string;
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
