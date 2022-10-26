import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';
import GetBasics from 'queries/Basics/GetBasics';
import {
  GetBasics as GetBasicsType,
  GetBasicsVariables
} from 'queries/Basics/types/GetBasics';
import DeletePlanFavorite from 'queries/Favorite/DeletePlanFavorite';
import { DeletePlanFavoriteVariables } from 'queries/Favorite/types/DeletePlanFavorite';

type UnfollowProps = {
  children: React.ReactNode;
};

const UnfollowWrapper = ({ children }: UnfollowProps) => {
  const history = useHistory();
  const { t } = useTranslation('modelPlan');
  const { pathname, search } = useLocation();
  const { showMessageOnNextPage } = useMessage();

  const modelIDToRemove = search
    .replace(/.*modelID=(.*)\/?/g, '$1')
    .replace(/\/+$/, '');

  const [removeMutate] = useMutation<DeletePlanFavoriteVariables>(
    DeletePlanFavorite
  );

  const { data, error } = useQuery<GetBasicsType, GetBasicsVariables>(
    GetBasics,
    {
      variables: {
        id: modelIDToRemove
      }
    }
  );

  const modelName = data?.modelPlan.modelName;

  useEffect(() => {
    if (pathname === '/unfollow/' && error) {
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
      history.push(`/models`);
    }
    if (pathname === '/unfollow/' && modelName) {
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
    error,
    history,
    modelIDToRemove,
    modelName,
    pathname,
    removeMutate,
    showMessageOnNextPage,
    t
  ]);

  return <>{children}</>;
};

export default UnfollowWrapper;
