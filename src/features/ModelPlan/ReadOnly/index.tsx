import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon, SummaryBox } from '@trussworks/react-uswds';
import classnames from 'classnames';
import NotFound from 'features/NotFound';
import {
  GetModelSummaryQuery,
  ModelStatus,
  TeamRole,
  useGetModelSummaryQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import { FavoriteIcon } from 'components/FavoriteCard';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageLoading from 'components/PageLoading';
import SectionWrapper from 'components/SectionContainer';
import ShareExportModal from 'components/ShareExport';
import StatusBanner from 'components/StatusBanner';
import SAMPLE_MODEL_UUID_STRING from 'constants/sampleModelPlan';
import PrintPDFWrapper from 'contexts/PrintPDFContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useFavoritePlan from 'hooks/useFavoritePlan';
import { isAssessment, isMAC } from 'utils/user';

import NDABanner from '../../../components/NDABanner';
import { UpdateFavoriteProps } from '../ModelPlanOverview';
import { StatusMessageType } from '../TaskList';

import ContactInfo from './_components/ContactInfo';
import FilterViewBanner from './_components/FilterView/Banner';
import FilteredViewBodyContent from './_components/FilterView/BodyContent';
import {
  FilterGroup,
  filterGroups
} from './_components/FilterView/BodyContent/_filterGroupMapping';
import FilterViewModal from './_components/FilterView/Modal';
import { groupOptions } from './_components/FilterView/util';
import MobileNav from './_components/MobileNav';
import ModelSummary from './_components/ModelSummary';
import SideNav from './_components/Sidenav';
import ReadOnlyGeneralCharacteristics from './GeneralCharacteristics/index';
import ReadOnlyModelBasics from './ModelBasics/index';
import ReadOnlyParticipantsAndProviders from './ParticipantsAndProviders/index';
import ReadOnlyBeneficiaries from './Beneficiaries';
import ReadOnlyCRTDLs from './CRTDLs';
import ReadOnlyDataExchangeApproach from './DataExchangeapproach';
import ReadOnlyDiscussions from './Discussions';
import ReadOnlyDocuments from './Documents';
import ReadOnlyModelToOperations from './ModelToOperations';
import ReadOnlyOpsEvalAndLearning from './OpsEvalAndLearning';
import ReadOnlyPayments from './Payments';
import ReadOnlyTeamInfo from './Team';

import './index.scss';

type GetModelSummaryTypes = GetModelSummaryQuery['modelPlan'];

export const readViewGroup = [
  'model-plan',
  'model-design-activities',
  'model-to-operations',
  'other-model-info'
] as const;

export type ReadViewGroupType = (typeof readViewGroup)[number];

export type subComponentProps = {
  route: string;
  helpRoute: string;
  group: ReadViewGroupType;
  component: React.ReactNode;
};

export interface subComponentsProps {
  [key: string]: subComponentProps;
}

const listOfSubpageKey: string[] = [
  'model-basics',
  'general-characteristics',
  'participants-and-providers',
  'beneficiaries',
  'operations-evaluation-and-learning',
  'payment',
  'milestones',
  'team',
  'discussions',
  'documents',
  'crs-and-tdl',
  'data-exchange-approach'
];

export const ReadOnlyComponents = (
  modelID: string,
  isHelpArticle?: boolean
): subComponentsProps => {
  return {
    'model-basics': {
      route: `/models/${modelID}/read-only/model-basics`,
      helpRoute: '/help-and-knowledge/sample-model-plan/model-basics',
      group: 'model-plan',
      component: <ReadOnlyModelBasics modelID={modelID} />
    },
    'general-characteristics': {
      route: `/models/${modelID}/read-only/general-characteristics`,
      helpRoute:
        '/help-and-knowledge/sample-model-plan/general-characteristics',
      group: 'model-plan',
      component: <ReadOnlyGeneralCharacteristics modelID={modelID} />
    },
    'participants-and-providers': {
      route: `/models/${modelID}/read-only/participants-and-providers`,
      helpRoute:
        '/help-and-knowledge/sample-model-plan/participants-and-providers',
      group: 'model-plan',
      component: <ReadOnlyParticipantsAndProviders modelID={modelID} />
    },
    beneficiaries: {
      route: `/models/${modelID}/read-only/beneficiaries`,
      helpRoute: '/help-and-knowledge/sample-model-plan/beneficiaries',
      group: 'model-plan',
      component: <ReadOnlyBeneficiaries modelID={modelID} />
    },
    'operations-evaluation-and-learning': {
      route: `/models/${modelID}/read-only/operations-evaluation-and-learning`,
      helpRoute:
        '/help-and-knowledge/sample-model-plan/operations-evaluation-and-learning',
      group: 'model-plan',
      component: <ReadOnlyOpsEvalAndLearning modelID={modelID} />
    },
    payment: {
      route: `/models/${modelID}/read-only/payment`,
      helpRoute: '/help-and-knowledge/sample-model-plan/payment',
      group: 'model-plan',
      component: <ReadOnlyPayments modelID={modelID} />
    },
    'data-exchange-approach': {
      route: `/models/${modelID}/read-only/data-exchange-approach`,
      helpRoute: '/help-and-knowledge/sample-model-plan/data-exchange-approach',
      component: <ReadOnlyDataExchangeApproach modelID={modelID} />,
      group: 'model-design-activities'
    },
    milestones: {
      route: `/models/${modelID}/read-only/milestones`,
      component: <ReadOnlyModelToOperations modelID={modelID} />,
      helpRoute: '/help-and-knowledge/sample-model-plan/milestones',
      group: 'model-to-operations'
    },
    team: {
      route: `/models/${modelID}/read-only/team`,
      helpRoute: '/help-and-knowledge/sample-model-plan/team',
      component: <ReadOnlyTeamInfo modelID={modelID} />,
      group: 'other-model-info'
    },
    discussions: {
      route: `/models/${modelID}/read-only/discussions`,
      helpRoute: '/help-and-knowledge/sample-model-plan/discussions',
      component: <ReadOnlyDiscussions modelID={modelID} />,
      group: 'other-model-info'
    },
    documents: {
      route: `/models/${modelID}/read-only/documents`,
      helpRoute: '/help-and-knowledge/sample-model-plan/documents',
      component: (
        <ReadOnlyDocuments modelID={modelID} isHelpArticle={isHelpArticle} />
      ),
      group: 'other-model-info'
    },
    'crs-and-tdl': {
      route: `/models/${modelID}/read-only/crs-and-tdl`,
      helpRoute: '/help-and-knowledge/sample-model-plan/crs-and-tdl',
      component: <ReadOnlyCRTDLs />,
      group: 'other-model-info'
    }
  };
};

export type SubpageKey = (typeof listOfSubpageKey)[number];

const isSubpage = (
  x: SubpageKey,
  flags: any,
  isHelpArticle?: boolean
): boolean => {
  if (isHelpArticle) {
    return listOfSubpageKey
      .filter(subpage => subpage !== 'discussions')
      .includes(x);
  }
  // if (flags.hideITLeadExperience) {
  //   return listOfSubpageKey
  //     .filter(subpage => subpage !== 'milestones')
  //     .includes(x);
  // }
  return listOfSubpageKey.includes(x);
};

export const filteredViewOutput = (value: string) => {
  if (value === 'cmmi') {
    return groupOptions.filter(n => n.value.includes(value))[0].label;
  }
  return groupOptions
    .filter(n => n.value.includes(value))[0]
    .value.toUpperCase();
};

// Checks if the url query param is a valid filteredView and converts to lowercase
// Returns null for any query param that is not a valid filteredView
export const getValidFilterViewParam = (param: string | null) => {
  if (param && filterGroups.includes(param.toLowerCase())) {
    return param.toLowerCase() as FilterGroup;
  }
  return null;
};

const ReadOnly = ({ isHelpArticle }: { isHelpArticle?: boolean }) => {
  const { t: h } = useTranslation('generalReadOnly');
  const { t: filterViewT } = useTranslation('filterView');

  const { modelID = isHelpArticle ? SAMPLE_MODEL_UUID_STRING : '', subinfo } =
    useParams<{
      modelID: string;
      subinfo: SubpageKey;
    }>();

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');
  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const flags = useFlags();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filteredViewParam = params.get('filter-view');

  const filteredView = getValidFilterViewParam(filteredViewParam);

  const isViewingFilteredGroup = filteredView !== null;

  // Used to check if user is assessment for rendering subnav to task list
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);

  const [statusMessage, setStatusMessage] = useState<StatusMessageType | null>(
    null
  );

  const [isFilterViewModalOpen, setIsFilterViewModalOpen] =
    useState<boolean>(false);

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const { data, loading, error, refetch } = useGetModelSummaryQuery({
    variables: {
      id: modelID
    }
  });

  const favoriteMutations = useFavoritePlan();

  const handleUpdateFavorite = (
    modelPlanID: string,
    type: UpdateFavoriteProps
  ) => {
    favoriteMutations[type]({
      variables: {
        modelPlanID
      }
    }).then(() => refetch());
  };

  const {
    id,
    abbreviation,
    modelName,
    isFavorite,
    createdDts,
    modifiedDts,
    status,
    basics,
    generalCharacteristics,
    collaborators,
    isCollaborator,
    echimpCRsAndTDLs
  } = data?.modelPlan || ({} as GetModelSummaryTypes);

  const hasEditAccess: boolean =
    !isHelpArticle &&
    !isMAC(groups) &&
    (isCollaborator || isAssessment(groups, flags));

  const subComponents = ReadOnlyComponents(modelID, isHelpArticle);

  if (isHelpArticle) delete subComponents.discussions;

  // if (flags.hideITLeadExperience) {
  //   delete subComponents.milestones;
  // }

  const subComponent = subComponents[subinfo];

  if (!data && loading) {
    return <PageLoading />;
  }

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFound />;
  }

  if (!isSubpage(subinfo, flags, isHelpArticle) && !isViewingFilteredGroup) {
    return <NotFound />;
  }

  const Summary = (
    <SummaryBox
      className="padding-y-6 padding-x-2 border-0 bg-primary-lighter radius-0 margin-top-0"
      data-testid="read-only-model-summary"
    >
      <GridContainer
        className={classnames({
          'padding-x-0': isMobile,
          'padding-x-2': isTablet
        })}
      >
        {statusMessage && (
          <Alert
            slim
            type={statusMessage.status}
            className="margin-bottom-4"
            closeAlert={setStatusMessage}
          >
            {statusMessage.message}
          </Alert>
        )}

        {!isHelpArticle && (
          <div className="mint-no-print margin-bottom-3">
            <div className="display-flex flex-justify">
              <UswdsReactLink
                to="/models"
                className="display-flex flex-align-center"
              >
                <Icon.ArrowBack className="text-primary margin-right-1" />
                {h('back')}
              </UswdsReactLink>

              <FavoriteIcon
                isFavorite={isFavorite}
                modelPlanID={id}
                updateFavorite={handleUpdateFavorite}
              />
            </div>
          </div>
        )}

        {isHelpArticle ? (
          <h2
            className="mint-h1 margin-0 line-height-sans-2 minh-6 margin-bottom-2"
            tabIndex={-1}
            aria-live="polite"
          >
            {modelName}{' '}
            {abbreviation && (
              <span className="font-sans-sm text-normal">({abbreviation})</span>
            )}
          </h2>
        ) : (
          <h1
            className="mint-h1 margin-0 line-height-sans-2 minh-6 margin-bottom-2"
            tabIndex={-1}
            aria-live="polite"
          >
            {modelName}{' '}
            {abbreviation && (
              <span className="font-sans-sm text-normal">({abbreviation})</span>
            )}
          </h1>
        )}

        <StatusBanner
          isReadView
          modelID={modelID}
          status={status}
          statusLabel
          modifiedOrCreateLabel={!!modifiedDts}
          modifiedDts={modifiedDts ?? createdDts}
          hasEditAccess={hasEditAccess}
        />

        {!isViewingFilteredGroup && (
          <div className="mint-no-print">
            <ModelSummary
              goal={basics?.goal ?? ''}
              loading={loading}
              modelName={modelName}
              characteristics={generalCharacteristics}
              performancePeriodStarts={basics?.performancePeriodStarts ?? null}
              modelLeads={collaborators?.filter(c =>
                c.teamRoles.includes(TeamRole.MODEL_LEAD)
              )}
              crTdls={echimpCRsAndTDLs}
            />
          </div>
        )}
      </GridContainer>
    </SummaryBox>
  );

  const ModelWarning = (
    <>
      {status !== ModelStatus.CLEARED && status !== ModelStatus.ANNOUNCED && (
        <Alert
          type="warning"
          className="margin-top-2 margin-bottom-5 desktop:margin-y-3"
        >
          {h('alert')}
        </Alert>
      )}
    </>
  );

  return (
    <PrintPDFWrapper>
      <MainContent
        className="model-plan-read-only"
        data-testid="model-plan-read-only"
      >
        <NDABanner collapsable />
        <Modal
          isOpen={isFilterViewModalOpen}
          closeModal={() => setIsFilterViewModalOpen(false)}
          shouldCloseOnOverlayClick
          className="radius-md"
          modalHeading={filterViewT('filterView')}
        >
          <FilterViewModal
            closeModal={() => setIsFilterViewModalOpen(false)}
            filteredView={filteredView}
          />
        </Modal>

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
            filteredView={filteredView}
            setStatusMessage={setStatusMessage}
          />
        </Modal>

        {Summary}

        {!flags.hideGroupView && (
          <FilterViewBanner
            filteredView={
              filteredView &&
              (filteredViewOutput(
                filteredView
              ) as (typeof filterGroups)[number])
            }
            openFilterModal={() => setIsFilterViewModalOpen(true)}
            openExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        <MobileNav
          subComponents={subComponents}
          subinfo={subinfo}
          isHelpArticle={isHelpArticle}
          isFilteredView={!!filteredView}
        />

        <GridContainer className="model-plan-alert-wrapper">
          {ModelWarning}
        </GridContainer>

        <SectionWrapper
          className="model-plan__body-content margin-top-4"
          id="scroll-element"
        >
          <GridContainer>
            {isViewingFilteredGroup ? (
              <FilteredViewBodyContent
                modelID={modelID}
                filteredView={filteredView}
              />
            ) : (
              <Grid row gap>
                {!isMobile && (
                  <Grid
                    desktop={{ col: 3 }}
                    className="padding-right-4 sticky-nav"
                  >
                    <SideNav
                      isHelpArticle={isHelpArticle}
                      subComponents={subComponents}
                    />
                  </Grid>
                )}

                <Grid desktop={{ col: 9 }}>
                  <div
                    id={
                      subinfo
                        ? `read-only-model-plan__${subinfo}-component`
                        : ''
                    }
                  >
                    <GridContainer className="padding-left-0 padding-right-0">
                      <Grid row gap>
                        {/* Central component */}
                        <Grid
                          desktop={{
                            col:
                              subinfo === 'documents' ||
                              subinfo === 'crs-and-tdl' ||
                              subinfo === 'milestones'
                                ? 12
                                : 8
                          }}
                        >
                          {subComponent.component}
                        </Grid>
                        {/* Contact info sidebar */}
                        {subinfo !== 'documents' &&
                          subinfo !== 'crs-and-tdl' &&
                          subinfo !== 'milestones' && (
                            <Grid
                              desktop={{ col: 4 }}
                              className={classnames({
                                'sticky-nav': !isMobile
                              })}
                            >
                              <ContactInfo
                                modelID={modelID}
                                isViewingTeamPage={subinfo === 'team'}
                              />
                            </Grid>
                          )}
                      </Grid>
                    </GridContainer>
                  </div>
                </Grid>
              </Grid>
            )}
          </GridContainer>
        </SectionWrapper>
      </MainContent>
    </PrintPDFWrapper>
  );
};

export default ReadOnly;
