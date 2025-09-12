import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Grid,
  GridContainer,
  Header,
  Icon,
  PrimaryNav,
  Select
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import NotFound from 'features/NotFound';
import {
  MtoStatus,
  useGetModelToOperationsMatrixQuery
} from 'gql/generated/graphql';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageLoading from 'components/PageLoading';
import ShareExportModal from 'components/ShareExport';
import { EditMTOMilestoneProvider } from 'contexts/EditMTOMilestoneContext';
import { EditMTOSolutionProvider } from 'contexts/EditMTOSolutionContext';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import MTOTableActions from '../_components/ActionsTable';
import ITSystemsTable from '../_components/ITSystemsTable';
import MTOTable from '../_components/MatrixTable';
import MTOOptionsPanel from '../_components/OptionPanel';
import MTOStatusBanner from '../_components/StatusBanner';
import SuggestedMilestoneBanner from '../_components/SuggestedMilestoneBanner';

import './index.scss';

export type MTOOption = 'milestones' | 'solutions';

export const mtoOptions: MTOOption[] = ['milestones', 'solutions'];

const MTOHome = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const modelToOperationsMatrix = data?.modelPlan?.mtoMatrix;

  const dataAvalilable: boolean = !loading || !!modelToOperationsMatrix;

  const suggestedMilestones =
    modelToOperationsMatrix?.commonMilestones.filter(
      obj => obj.isSuggested && !obj.isAdded
    ) || [];

  const navigate = useNavigate();

  const location = useLocation();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const viewparam = params.get('view');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const [currentView, setCurrentView] = useState<MTOOption>('milestones');

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (viewparam && mtoOptions.includes(viewparam as MTOOption)) {
      setCurrentView(viewparam as MTOOption);
    } else {
      // Default to milestones if no view param present
      params.set('view', 'milestones');
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [viewparam, navigate, params]);

  const isMatrixStarted: boolean =
    data?.modelPlan.mtoMatrix.status !== MtoStatus.READY;

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <Modal
        isOpen={isExportModalOpen}
        closeModal={() => setIsExportModalOpen(false)}
        className="padding-0 radius-md share-export-modal__container"
        navigation
        shouldCloseOnOverlayClick
      >
        <ShareExportModal
          closeModal={() => setIsExportModalOpen(false)}
          modelID={modelID}
          setStatusMessage={() => null}
        />
      </Modal>

      <div className="shadow-2 z-100 position-relative">
        <GridContainer>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.COLLABORATION_AREA,
              BreadcrumbItemOptions.MODEL_TO_OPERATIONS
            ]}
          />

          <Grid row className="desktop:margin-bottom-6 margin-top-4">
            <Grid desktop={{ col: 9 }}>
              <h1 className="margin-y-0 line-height-large">{t('heading')}</h1>

              {dataAvalilable && (
                <p className="mint-body-large margin-bottom-2 margin-top-05">
                  {t('forModel', {
                    modelName
                  })}
                </p>
              )}

              {dataAvalilable && (
                <div className="margin-bottom-3">
                  <MTOStatusBanner
                    status={modelToOperationsMatrix?.status}
                    lastUpdated={modelToOperationsMatrix?.recentEdit?.date}
                  />
                </div>
              )}
              <UswdsReactLink
                to={`/models/${modelID}/collaboration-area`}
                data-testid="return-to-collaboration"
              >
                <span>
                  <Icon.ArrowBack
                    className="top-3px margin-right-1"
                    aria-label="back"
                  />
                  {t('returnToCollaboration')}
                </span>
              </UswdsReactLink>
            </Grid>

            <Grid desktop={{ col: 3 }}>
              <AskAQuestion
                modelID={modelID}
                className="margin-top-3 desktop:margin-top-0 margin-bottom-2"
                renderTextFor="modelToOperations"
              />

              <Button
                type="button"
                unstyled
                onClick={() => setIsExportModalOpen(true)}
              >
                {collaborationAreaT('mtoCard.shareOrExport')}
              </Button>
            </Grid>
          </Grid>

          <Header
            basic
            extended={false}
            className="model-to-operations__nav-container"
          >
            <div className="usa-nav-container padding-0">
              <PrimaryNav
                items={mtoOptions.map(item => (
                  <button
                    type="button"
                    onClick={() => {
                      params.delete('type');
                      params.delete('hide-milestones-without-solutions');
                      params.set('view', item);
                      navigate({ search: params.toString() });
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
        </GridContainer>
      </div>

      {currentView === 'milestones' && (
        <SuggestedMilestoneBanner suggestedMilestones={suggestedMilestones} />
      )}

      <GridContainer>
        <div className="model-to-operations margin-y-6">
          {isTablet && (
            <div className="maxw-mobile-lg">
              <Select
                id="mto-navigation-select"
                name="currentView"
                value={currentView}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  params.set('view', e.target.value);
                  navigate({ search: params.toString() });
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

          <EditMTOMilestoneProvider>
            <EditMTOSolutionProvider>
              {currentView === 'milestones' && (
                <>
                  {!dataAvalilable ? (
                    <PageLoading />
                  ) : (
                    <>
                      {isMatrixStarted ? (
                        <>
                          <MTOTableActions />
                          <MTOTable
                            queryData={data}
                            loading={dataAvalilable}
                            error={error}
                          />
                        </>
                      ) : (
                        <MTOOptionsPanel />
                      )}
                    </>
                  )}
                </>
              )}

              {currentView === 'solutions' && (
                <>
                  {!dataAvalilable ? (
                    <PageLoading />
                  ) : (
                    <>
                      {isMatrixStarted ? (
                        <>
                          <MTOTableActions />
                          <ITSystemsTable />
                        </>
                      ) : (
                        <MTOOptionsPanel />
                      )}
                    </>
                  )}
                </>
              )}
            </EditMTOSolutionProvider>
          </EditMTOMilestoneProvider>
        </div>
      </GridContainer>
    </>
  );
};

export default MTOHome;
