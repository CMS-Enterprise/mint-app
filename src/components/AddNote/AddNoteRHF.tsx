import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, useField } from 'formik';

import { ErrorAlertMessage } from 'components/ErrorAlert';
import FieldGroup from 'components/FieldGroup';
import TextAreaField from 'components/TextAreaField';

type AddNoteType = {
  field: string;
  control: any;
  touched: boolean;
  className?: string;
};

const AddNoteRHF = ({
  field: fieldName,
  control,
  touched,
  className
}: AddNoteType) => {
  const { t } = useTranslation('general');

  const context = useFormContext();

  const noteValue = context.watch(fieldName);

  // State used to manage if an existing value is present on load
  const [note, setNote] = useState<boolean>(!!noteValue?.trim());

  useEffect(() => {
    setNote(!!noteValue?.trim());
  }, [noteValue]);

  // State used to manage manual toggle of note
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={classNames('margin-top-3 margin-bottom-6', className)}>
      {!note && !open && !touched && (
        <Button
          type="button"
          data-testid={`${fieldName}-add-note-toggle`}
          className="usa-button usa-button--unstyled"
          onClick={() => setOpen(true)}
        >
          <Icon.Add className="margin-right-1" aria-hidden />
          {t('additionalNote')}
        </Button>
      )}

      {(note || open || touched) && (
        <Controller
          name={fieldName}
          control={control}
          render={({ field: { ref, ...formField }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <TextAreaField
                {...formField}
                value={formField.value || ''}
                id={formField.name}
              />
            </FormGroup>
          )}
        />
      )}
    </div>
  );
};

export default AddNoteRHF;