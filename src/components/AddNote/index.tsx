import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconAdd } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field } from 'formik';

import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';

type AddNoteType = {
  field: string;
  id: string;
  className?: string;
};

const AddNote = ({ field, id, className }: AddNoteType) => {
  const { t } = useTranslation('draftModelPlan');
  const [note, setNote] = useState(false);

  return (
    <div className={classNames('margin-top-4 margin-bottom-8', className)}>
      <Button
        type="button"
        className="usa-button usa-button--unstyled"
        onClick={() => setNote(true)}
      >
        <IconAdd className="margin-right-1" aria-hidden />
        {t('additionalNote')}
      </Button>

      {note && (
        <FieldGroup>
          <Field
            as={TextAreaField}
            className="height-15"
            id={id}
            name={field}
            label={t('Notes')}
          />
        </FieldGroup>
      )}
    </div>
  );
};

export default AddNote;
