import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';

import FileUpload from 'components/FileUpload';

import { CtatTicketFormValues } from './CtatTicketForm';

type SupportingDocumentsUploadProps = {
  control: Control<CtatTicketFormValues>;
};

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

        const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newFile = e.target.files?.[0];
          if (newFile) {
            field.onChange([...files, newFile]);
          }
        };

        const removeFile = (index: number) => {
          field.onChange(files.filter((_, i) => i !== index));
        };

        return (
          <div>
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="display-flex flex-align-center margin-bottom-2"
              >
                <Icon.AttachFile className="margin-right-1" aria-hidden />
                <span className="margin-right-2">{file.name}</span>
                <Button
                  type="button"
                  unstyled
                  className="margin-top-0"
                  onClick={() => removeFile(index)}
                >
                  {t('ctatSidePanel.fields.supportingDocuments.remove')}
                </Button>
              </div>
            ))}
            <FileUpload
              id="ctat-supporting-documents"
              name="supportingDocuments"
              onChange={addFile}
              onBlur={() => null}
              inputProps={{
                'aria-label': t(
                  'ctatSidePanel.fields.supportingDocuments.label'
                )
              }}
            />
          </div>
        );
      }}
    />
  );
};

export default SupportingDocumentsUpload;
