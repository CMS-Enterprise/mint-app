import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FileUpload from 'components/FileUpload';

import { CtatTicketFormValues } from './CtatTicketForm';

type SupportingDocumentsUploadProps = {
  control: Control<CtatTicketFormValues>;
};

const isSameFile = (left: File, right: File) =>
  left.name === right.name &&
  left.size === right.size &&
  left.lastModified === right.lastModified;

const SupportingDocumentsUpload = ({
  control
}: SupportingDocumentsUploadProps) => {
  const { t } = useTranslation('contractAssistance');

  return (
    <Controller
      name="supportingDocuments"
      control={control}
      render={({ field }) => {
        const files: File[] = field.value || [];

        const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFiles = e.target.files
            ? Array.from(e.target.files)
            : [];
          const newFiles = selectedFiles.filter(
            selected => !files.some(existing => isSameFile(existing, selected))
          );

          if (newFiles.length > 0) {
            field.onChange([...files, ...newFiles]);
          }
        };

        return (
          <FileUpload
            id="ctat-supporting-documents"
            name="supportingDocuments"
            multiple
            files={files}
            showFileTypeIcons={false}
            onChange={addFiles}
            onBlur={() => null}
            inputProps={{
              'aria-label': t('ctatSidePanel.fields.supportingDocuments.label')
            }}
          />
        );
      }}
    />
  );
};

export default SupportingDocumentsUpload;
