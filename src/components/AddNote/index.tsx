import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, useField } from 'formik';

import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';

type AddNoteType = {
  field: string;
  id: string;
  className?: string;
};

const AddNote = ({ field: fieldName, id, className }: AddNoteType) => {
  const { t } = useTranslation('draftModelPlan');

  // Formik hook used to fetch the field value based on the field name
  // meta isn't technically required for the component to work but ts throws errors if not instantiated alongside 'helpers'
  const [field, meta, helpers] = useField(fieldName);

  // State used to manage if an existing value is present on load
  const [note, setNote] = useState<boolean>(!!field.value?.trim());

  // State used to manage manual toggle of note
  const [open, setOpen] = useState<boolean>(false);

  // State used to manage if touched - ex: Toggle note open, types, then erases all text
  // Should not collapse the textarea if text is erased
  const [touched, setTouched] = useState<boolean>(false);

  // Sets the note value from GQL once fetched
  // Empty spaces characters should act as empty string
  useEffect(() => {
    setNote(!!field.value?.trim());
  }, [field.value, note]);

  const { setValue } = helpers;

  return (
    <div className={classNames('margin-top-3 margin-bottom-6', className)}>
      {!note && !open && !touched && (
        <Button
          type="button"
          data-testid="add-note-toggle"
          className="usa-button usa-button--unstyled"
          onClick={() => setOpen(true)}
        >
          <Icon.Add className="margin-right-1" aria-hidden />
          {t('additionalNote')}
        </Button>
      )}

      {(note || open || touched) && (
        <FieldGroup>
          <Field
            as={TextAreaField}
            id={id}
            data-testid={id}
            name={fieldName}
            label={t('Notes')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValue(e.target.value);
              setTouched(true);
            }}
          />
        </FieldGroup>
      )}
      {meta.error && (
        <ErrorAlertMessage errorKey={meta.error} message={meta.error} />
      )}
    </div>
  );
};

export default AddNote;
