import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Grid,
  Header,
  Icon,
  PrimaryNav,
  Select
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useGetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Expire from 'components/Expire';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import { MTOModalProvider } from 'contexts/MTOModalContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';

import MTOTableActions from '../_components/ActionsTable';
import MTOModal from '../_components/FormModal';
import MTOOptionsPanel from '../_components/OptionPanel';
import MTOStatusBanner from '../_components/StatusBanner';
import MTOTable, { isMatrixStartedFc } from '../_components/Table';

export type MTOOption = 'milestones' | 'systems-and-solutions';

export const mtoOptions: MTOOption[] = ['milestones', 'systems-and-solutions'];

const MTOHome = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const modelToOperationsMatrix = data?.modelPlan?.mtoMatrix;

  const history = useHistory();

  const location = useLocation();

  const { message } = useMessage();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const viewparam = params.get('view');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const [currentView, setCurrentView] = useState<MTOOption>('milestones');

  useEffect(() => {
    if (viewparam && mtoOptions.includes(viewparam as MTOOption)) {
      setCurrentView(viewparam as MTOOption);
    } else {
      // Default to milestones if no view param present
      params.set('view', 'milestones');
      history.replace({ search: params.toString() });
    }
  }, [viewparam, history, params]);

  const isMatrixStarted: boolean = useMemo(() => {
    return isMatrixStartedFc(data?.modelPlan.mtoMatrix);
  }, [data?.modelPlan.mtoMatrix]);

  return (
    <>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.MODEL_TO_OPERATIONS
        ]}
      />

      {message && <Expire delay={45000}>{message}</Expire>}

      <Grid row className="margin-bottom-2">
        <Grid desktop={{ col: 9 }}>
          <h1 className="margin-bottom-0 margin-top-5 line-height-large">
            {t('heading')}
          </h1>

          {!loading && (
            <p className="mint-body-large margin-bottom-2 margin-top-05">
              {t('forModel', {
                modelName
              })}
            </p>
          )}

          {!loading && (
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

      <div className="model-to-operations margin-y-6">
        <Header
          basic
          extended={false}
          className="margin-bottom-4 model-to-operations__nav-container"
        >
          <div className="usa-nav-container padding-0">
            <PrimaryNav
              items={mtoOptions.map(item => (
                <button
                  type="button"
                  onClick={() => {
                    params.set('view', item);
                    history.push({ search: params.toString() });
                  }}
                  className={classNames(
                    'usa-nav__link margin-left-neg-2 margin-right-2',
                    {
                      'usa-current': currentView === item
                    }
                  )}
                >
                  <span
                    className={classNames({
                      'text-primary': currentView === item
                    })}
                  >
                    {t(item)}
                  </span>
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
              onChange={e => {
                params.set('view', e.target.value);
                history.push({ search: params.toString() });
              }}
              className="margin-bottom-4 text-primary text-bold"
            >
              {mtoOptions.map(item => {
                return (
                  <option key={item} value={item}>
                    {t(item)}
                  </option>
                );
              })}
            </Select>
          </div>
        )}

        {currentView === 'milestones' && (
          <>
            {loading ? (
              <PageLoading />
            ) : (
              <MTOModalProvider>
                <MTOModal />

                {isMatrixStarted ? (
                  <>
                    <MTOTableActions />
                    <MTOTable
                      queryData={data}
                      loading={loading}
                      error={error}
                    />
                  </>
                ) : (
                  <MTOOptionsPanel />
                )}
              </MTOModalProvider>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MTOHome;
