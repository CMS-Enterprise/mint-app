import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconAdd } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, useField } from 'formik';

import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';

type AddNoteType = {
  field: string;
  id: string;
  className?: string;
};

const AddNote = ({ field: fieldName, id, className }: AddNoteType) => {
  const { t } = useTranslation('draftModelPlan');
  const [field] = useField(fieldName);
  const [note, setNote] = useState<boolean>(!!field.value?.trim());

  useEffect(() => {
    if (!note) setNote(!!field.value?.trim());
  }, [field.value, note]);

  return (
    <div className={classNames('margin-top-4 margin-bottom-8', className)}>
      {!note && (
        <Button
          type="button"
          data-testid="add-note-toggle"
          className="usa-button usa-button--unstyled"
          onClick={() => setNote(true)}
        >
          <IconAdd className="margin-right-1" aria-hidden />
          {t('additionalNote')}
        </Button>
      )}

      {note && (
        <FieldGroup>
          <Field
            as={TextAreaField}
            className="height-15"
            id={id}
            data-testid={id}
            name={fieldName}
            label={t('Notes')}
          />
        </FieldGroup>
      )}
    </div>
  );
};

export default AddNote;
