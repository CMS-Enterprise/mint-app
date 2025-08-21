import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useDeletePlanFavoriteMutation,
  useGetBasicsQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import useMessage from 'hooks/useMessage';

const Unfollow = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('miscellaneous');
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const { showMessageOnNextPage } = useMessage();

  const modelIDToRemove = params.get('modelID');

  const [removeMutate] = useDeletePlanFavoriteMutation();

  const { setErrorMeta } = useErrorMessage();

  const { data, error } = useGetBasicsQuery({
    variables: {
      id: modelIDToRemove!
    }
  });

  const modelName = data?.modelPlan.modelName;

  useEffect(() => {
    if (error) {
      showMessageOnNextPage(
        <Alert
          type="error"
          slim
          data-testid="mandatory-fields-alert"
          className="margin-y-4"
        >
          <span className="mandatory-fields-alert__text">
            {t('favorite.error')}
          </span>
        </Alert>
      );
      navigate('/models');
    }
    if (modelName) {
      setErrorMeta({
        overrideMessage: t('favorite.failure', {
          requestName: modelName
        })
      });

      removeMutate({
        variables: {
          modelPlanID: modelIDToRemove!
        }
      })
        .then(response => {
          if (!response?.errors) {
            toastSuccess(
              <span className="mandatory-fields-alert__text">
                {t('favorite.success', {
                  requestName: modelName
                })}
              </span>
            );
            navigate('/models');
          }
        })
        .catch(errors => {
          navigate('/models');
        });
    }
  }, [
    error,
    navigate,
    modelIDToRemove,
    modelName,
    removeMutate,
    showMessageOnNextPage,
    t,
    setErrorMeta
  ]);

  return <PageLoading />;
};

export default Unfollow;
