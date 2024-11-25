import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { Grid, Icon } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { useGetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useMessage from 'hooks/useMessage';

import MTOStatusBanner from './_components/StatusBanner';
import MTOHome from './Home';

import './index.scss';

const ModelToOperations = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { modelName } = useContext(ModelInfoContext);

  const { data } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const { message } = useMessage();

  const modelToOperationsMatrix = data?.modelPlan?.mtoMatrix;

  return (
    <MainContent
      className="grid-container mint-body-normal"
      data-testid="model-to-operations"
    >
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.MODEL_TO_OPERATIONS
        ]}
      />

      {message}

      <Grid row className="margin-bottom-2">
        <Grid desktop={{ col: 9 }}>
          <h1 className="margin-bottom-0 margin-top-5 line-height-large">
            {t('heading')}
          </h1>

          {modelToOperationsMatrix && (
            <p className="mint-body-large margin-bottom-2 margin-top-05">
              {t('forModel', {
                modelName
              })}
            </p>
          )}

          {modelToOperationsMatrix && (
            <MTOStatusBanner
              status={modelToOperationsMatrix?.status}
              lastUpdated={modelToOperationsMatrix?.recentEdit?.modifiedDts}
            />
          )}
        </Grid>

        <Grid desktop={{ col: 3 }}>
          <AskAQuestion
            modelID={modelID}
            className="margin-top-6 margin-bottom-4"
            renderTextFor="modelToOperations"
          />
        </Grid>
      </Grid>

      <UswdsReactLink
        to={`/models/${modelID}/collaboration-area`}
        data-testid="return-to-collaboration"
      >
        <span>
          <Icon.ArrowBack className="top-3px margin-right-1" />
          {t('returnToCollaboration')}
        </span>
      </UswdsReactLink>

      <Switch>
        <ProtectedRoute
          path="/models/:modelID/collaboration-area/model-to-operations/matrix"
          component={MTOHome}
          exact
        />

        <Redirect
          exact
          from="/models/:modelID/collaboration-area/model-to-operations"
          to="/models/:modelID/collaboration-area/model-to-operations/matrix"
        />

        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default ModelToOperations;
