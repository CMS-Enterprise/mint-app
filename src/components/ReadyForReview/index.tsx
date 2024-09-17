import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBox } from '@trussworks/react-uswds';
import { Field } from 'formik';
import { TaskStatus, TaskStatusInput } from 'gql/generated/graphql';

import CheckboxField from 'components/CheckboxField';
import FieldGroup from 'components/FieldGroup';
import { formatDateLocal } from 'utils/date';

type ReadyForReviewType = {
  id: string;
  field: string;
  sectionName: string;
  status: TaskStatus;
  setFieldValue: (field: string, value: any) => void;
  readyForReviewBy: string | null | undefined;
  readyForReviewDts: string | null | undefined;
};

const ReadyForReview = ({
  id,
  field,
  sectionName,
  status,
  setFieldValue,
  readyForReviewBy,
  readyForReviewDts
}: ReadyForReviewType) => {
  const { t } = useTranslation('general');

  // Status state is checked before rendering
  // This is so that when user unclicks the "Ready for review" checkbox, it will not cause the `markedReady` copy to disappear
  const [persistentCopy] = useState<boolean>(
    status === TaskStatus.READY_FOR_REVIEW
  );

  return (
    <FieldGroup className="margin-top-8 margin-bottom-3">
      <SummaryBox className="bg-white border-base-light padding-2">
        <p className="margin-0">{t('modelPlanStatus')}</p>
        <Field
          as={CheckboxField}
          id={id}
          testid={id}
          name={field}
          label={t('modelPlanCopy', {
            sectionName: `${sectionName}`
          })}
          checked={status === TaskStatus.READY_FOR_REVIEW}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
              setFieldValue('status', TaskStatusInput.READY_FOR_REVIEW);
            } else {
              setFieldValue('status', TaskStatusInput.IN_PROGRESS);
            }
          }}
        />
        {persistentCopy && readyForReviewBy && readyForReviewDts && (
          <p className="margin-top-1 margin-bottom-0 margin-left-4 text-base">
            {t('markedReady', {
              reviewer: readyForReviewBy
            })}
            {formatDateLocal(readyForReviewDts, 'MM/dd/yyyy')}
          </p>
        )}
      </SummaryBox>
    </FieldGroup>
  );
};

export default ReadyForReview;
