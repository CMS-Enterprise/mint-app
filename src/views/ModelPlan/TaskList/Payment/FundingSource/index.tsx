import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { FormikProps } from 'formik';

const FundingSource = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  // const formikRef = useRef<FormikProps<PaymentsFormType>>(null);
  const history = useHistory();

  // const { data, loading, error } = useQuery<GetPerformanceType>(
  //   GetPerformance,
  //   {
  //     variables: {
  //       id: modelID
  //     }
  //   }
  // );

  const {
    id
    // ...
  } = data?.modelPlan?.opsEvalAndLearning || ({} as PaymentsFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  const handleFormSubmit = (
    formikValues: PaymentsFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    const { id: updateId, __typename, ...changeValues } = formikValues;
    update({
      variables: {
        id: updateId,
        changes: changeValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/payments/evaluation`);
          } else if (redirect === 'back') {
            if (iddocSupport) {
              history.push(
                `/models/${modelID}/task-list/payments/iddoc-monitoring`
              );
            } else {
              history.push(`/models/${modelID}/task-list/payments`);
            }
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  return <div>FundingSource</div>;
};

export default FundingSource;
