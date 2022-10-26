import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';
import GetBasics from 'queries/Basics/GetBasics';
import {
  GetBasics as GetBasicsType,
  GetBasicsVariables
} from 'queries/Basics/types/GetBasics';
import DeletePlanFavorite from 'queries/Favorite/DeletePlanFavorite';
import { DeletePlanFavoriteVariables } from 'queries/Favorite/types/DeletePlanFavorite';

const Unfollow = () => {
  const history = useHistory();
  const { t } = useTranslation('modelPlan');
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const { showMessageOnNextPage } = useMessage();

  const modelIDToRemove = params.get('modelID');

  const [removeMutate] = useMutation<DeletePlanFavoriteVariables>(
    DeletePlanFavorite
  );

  const { data, error } = useQuery<GetBasicsType, GetBasicsVariables>(
    GetBasics,
    {
      variables: {
        id: modelIDToRemove!
      }
    }
  );

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
      history.push('/models');
    }
    if (modelName) {
      removeMutate({
        variables: {
          modelPlanID: modelIDToRemove
        }
      })
        .then(response => {
          if (!response?.errors) {
            showMessageOnNextPage(
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  {t('favorite.success', {
                    requestName: modelName
                  })}
                </span>
              </Alert>
            );
            history.push('/models');
          }
        })
        .catch(errors => {
          showMessageOnNextPage(
            <Alert
              type="error"
              slim
              data-testid="mandatory-fields-alert"
              className="margin-y-4"
            >
              <span className="mandatory-fields-alert__text">
                {t('favorite.failure', {
                  requestName: modelName
                })}
              </span>
            </Alert>
          );
          history.push('/models');
        });
    }
  }, [
    error,
    history,
    modelIDToRemove,
    modelName,
    removeMutate,
    showMessageOnNextPage,
    t
  ]);

  return <PageLoading />;
};

export default Unfollow;
