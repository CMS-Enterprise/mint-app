import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBox } from '@trussworks/react-uswds';
import { Field } from 'formik';

import CheckboxField from 'components/shared/CheckboxField';
import FieldGroup from 'components/shared/FieldGroup';

type ReadyForReviewType = {
  field: string;
  id: string;
};

const ReadyForReview = ({ field, id }: ReadyForReviewType) => {
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
            sectionName: 'Participants and providers'
          })}
          value="test"
          // checked={values.fundingSource?.includes(type as FundingSourceEnum)}
        />
      </SummaryBox>
    </FieldGroup>
  );
};

export default ReadyForReview;
