import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useParams } from 'react-router-dom';
import { Grid, Icon } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { useGetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import { ModelInfoContext } from 'contexts/ModelInfoContext';

import { TaskListStatusTag } from '../TaskList/_components/TaskListItem';

import MTOHome from './Home';

const ModelToOperations = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const modelToOperationsMatrix = data?.modelPlan?.mtoMatrix;

  return (
    <MainContent
      className="grid-container mint-body-normal"
      data-testid="model-payment"
    >
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.MODEL_TO_OPERATIONS
        ]}
      />

      <Grid row className="margin-bottom-2">
        <Grid desktop={{ col: 9 }}>
          <h1 className="margin-bottom-0 margin-top-5 line-height-large">
            {t('heading')}
          </h1>

          <p className="mint-body-large margin-bottom-2 margin-top-05">
            {t('forModel', {
              modelName
            })}
          </p>

          <TaskListStatusTag
            status={modelToOperationsMatrix?.status}
            classname="width-fit-content"
          />
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
          path="/models/:modelID/collaboration-area/model-to-operations"
          component={MTOHome}
          exact
        />

        <Route path="*" render={() => <NotFoundPartial />} />
      </Switch>
    </MainContent>
  );
};

export default ModelToOperations;
