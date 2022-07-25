import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBox } from '@trussworks/react-uswds';
import { Field } from 'formik';

import CheckboxField from 'components/shared/CheckboxField';
import FieldGroup from 'components/shared/FieldGroup';
import { TaskStatus, TaskStatusInput } from 'types/graphql-global-types';

type ReadyForReviewType = {
  field: string;
  id: string;
  sectionName: string;
  status: TaskStatus;
};

const ReadyForReview = ({
  field,
  id,
  sectionName,
  status
}: ReadyForReviewType) => {
  const { t } = useTranslation('draftModelPlan');
  return (
    <FieldGroup className="margin-top-8 margin-bottom-3">
      <SummaryBox heading="" className="bg-white border-base-light padding-2">
        <p className="margin-0">{t('modelPlanStatus')}</p>
        <Field
          as={CheckboxField}
          id={id}
          data-testid={id}
          name={field}
          label={t('modelPlanCopy', {
            sectionName: `${sectionName}`
          })}
          value={TaskStatusInput.READY_FOR_REVIEW}
          checked={status === TaskStatus.READY_FOR_REVIEW}
        />
      </SummaryBox>
    </FieldGroup>
  );
};

export default ReadyForReview;
