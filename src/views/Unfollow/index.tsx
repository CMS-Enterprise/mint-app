import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';
import DeletePlanFavorite from 'queries/Favorite/DeletePlanFavorite';
import { DeletePlanFavoriteVariables } from 'queries/Favorite/types/DeletePlanFavorite';
import GetModelPlan from 'queries/GetModelPlan';
import {
  GetModelPlan as GetModelPlanType,
  GetModelPlan_modelPlan as GetModelPlanTypes,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';

type UnfollowProps = {
  children: React.ReactNode;
};

const UnfollowWrapper = ({ children }: UnfollowProps) => {
  const { pathname, search } = useLocation();
  const history = useHistory();
  const { showMessageOnNextPage } = useMessage();
  const { t } = useTranslation('modelPlan');

  const modelIDToRemove = search
    .replace(/.*modelID=(.*)\/?/g, '$1')
    .replace(/\/+$/, '');

  const [removeMutate] = useMutation<DeletePlanFavoriteVariables>(
    DeletePlanFavorite
  );
  const { data } = useQuery<GetModelPlanType, GetModelPlanVariables>(
    GetModelPlan,
    {
      variables: {
        id: modelIDToRemove
      }
    }
  );

  const modelPlan = data?.modelPlan || ({} as GetModelPlanTypes);

  const { modelName } = modelPlan;

  useEffect(() => {
    console.log(modelName);
    if (pathname === '/unfollow/') {
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
            history.push(`/models`);
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
          history.push(`/models`);
        });
    }
  }, [
    history,
    modelIDToRemove,
    removeMutate,
    showMessageOnNextPage,
    t,
    pathname,
    modelName
  ]);

  return <>{children}</>;
};

export default UnfollowWrapper;
