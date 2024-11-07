import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useParams } from 'react-router-dom';
import {
  Grid,
  Header,
  Icon,
  PrimaryNav,
  Select
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { NotFoundPartial } from 'features/NotFound';
import { useGetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import MTOStatusBanner from './_components/StatusBanner';
import MTOHome from './Home';

import './index.scss';

type CurrentView = 'milestones' | 'systems';

const ModelToOperations = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { modelName } = useContext(ModelInfoContext);

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const [currentView, setCurrentView] = useState<CurrentView>('milestones');

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const modelToOperationsMatrix = data?.modelPlan?.mtoMatrix;

  const navItems: CurrentView[] = ['milestones', 'systems'];

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

          <MTOStatusBanner
            status={modelToOperationsMatrix?.status}
            lastUpdated={modelToOperationsMatrix?.recentEdit?.modifiedDts}
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

      <div className="model-to-operations margin-top-6">
        <Header
          basic
          extended={false}
          className="margin-bottom-4 model-to-operations__nav-container"
        >
          <div className="usa-nav-container padding-0">
            <PrimaryNav
              items={navItems.map(item => (
                <button
                  type="button"
                  onClick={() => setCurrentView(item)}
                  className={classNames(
                    'usa-nav__link margin-left-neg-2 margin-right-2',
                    {
                      'usa-current': currentView === item
                    }
                  )}
                >
                  <span>{t(item)}</span>
                </button>
              ))}
              mobileExpanded={false}
              className="flex-justify-start margin-0 padding-0"
            />
          </div>
        </Header>

        {isTablet && (
          <div className="maxw-mobile-lg">
            <Select
              id="mto-navigation-select"
              name="currentView"
              value={currentView}
              onChange={e =>
                setCurrentView(e.currentTarget.value as CurrentView)
              }
              className="margin-bottom-4 text-primary text-bold"
            >
              {navItems.map(item => {
                return (
                  <option key={item} value={item}>
                    {t(item)}
                  </option>
                );
              })}
            </Select>
          </div>
        )}
      </div>

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
