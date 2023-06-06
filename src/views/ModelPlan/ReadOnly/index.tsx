import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Grid,
  GridContainer,
  IconArrowBack,
  SummaryBox
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { FavoriteIcon } from 'components/FavoriteCard';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import ModelSubNav from 'components/ModelSubNav';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import SectionWrapper from 'components/shared/SectionWrapper';
import SAMPLE_MODEL_UUID_STRING from 'constants/sampleModelPlan';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useFavoritePlan from 'hooks/useFavoritePlan';
import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import {
  GetModelSummary as GetModelSummaryType,
  GetModelSummary_modelPlan as GetModelSummaryTypes
} from 'queries/ReadOnly/types/GetModelSummary';
import { ModelStatus, TeamRole } from 'types/graphql-global-types';
import { isAssessment, isMAC } from 'utils/user';
import NotFound, { NotFoundPartial } from 'views/NotFound';

import { UpdateFavoriteProps } from '../ModelPlanOverview';
import TaskListStatus from '../TaskList/_components/TaskListStatus';

import ContactInfo from './_components/ContactInfo';
import FilterViewBanner from './_components/FilterView/Banner';
import FilterViewModal from './_components/FilterView/Modal';
import SideNavFilterButton from './_components/FilterView/SideNavFilterButton';
import groupOptions from './_components/FilterView/util';
import MobileNav from './_components/MobileNav';
import ModelSummary from './_components/ModelSummary';
import SideNav from './_components/Sidenav';
import ReadOnlyGeneralCharacteristics from './GeneralCharacteristics/index';
import ReadOnlyModelBasics from './ModelBasics/index';
import ReadOnlyParticipantsAndProviders from './ParticipantsAndProviders/index';
import ReadOnlyBeneficiaries from './Beneficiaries';
import ReadOnlyCRTDLs from './CRTDLs';
import ReadOnlyDiscussions from './Discussions';
import ReadOnlyDocuments from './Documents';
import ReadOnlyOperationalNeeds from './OperationalNeeds';
import ReadOnlyOpsEvalAndLearning from './OpsEvalAndLearning';
import ReadOnlyPayments from './Payments';
import ReadOnlyTeamInfo from './Team';

import './index.scss';

export type subComponentProps = {
  route: string;
  helpRoute: string;
  component: React.ReactNode;
};

export interface subComponentsProps {
  [key: string]: subComponentProps;
}

const listOfSubpageKey = [
  'model-basics',
  'general-characteristics',
  'participants-and-providers',
  'beneficiaries',
  'operations-evaluation-and-learning',
  'payment',
  'it-solutions',
  'team',
  'discussions',
  'documents',
  'crs-and-tdl'
];

export type SubpageKey = typeof listOfSubpageKey[number];
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
  if (flags.hideITLeadExperience) {
    return listOfSubpageKey
      .filter(subpage => subpage !== 'it-solutions')
      .includes(x);
  }
  return listOfSubpageKey.includes(x);
};

const ReadOnly = ({ isHelpArticle }: { isHelpArticle?: boolean }) => {
  const { t: h } = useTranslation('generalReadOnly');
  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

  const flags = useFlags();

  const {
    modelID = isHelpArticle ? SAMPLE_MODEL_UUID_STRING : '',
    subinfo
  } = useParams<{
    modelID: string;
    subinfo: SubpageKey;
  }>();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filteredView = params.get('filter-view');
  const isViewingFilteredGroup = filteredView !== null;

  // Used to check if user is assessment for rendering subnav to task list
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);

  const descriptionRef = React.createRef<HTMLElement>();
  const [isDescriptionExpandable, setIsDescriptionExpandable] = useState(false);
  const [isFilterViewModalOpen, setIsFilterViewModalOpen] = useState(false);

  // Enable the description toggle if it overflows
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { current: el } = descriptionRef;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight) {
      setIsDescriptionExpandable(true);
    }
  });

  const { data, loading, error, refetch } = useQuery<GetModelSummaryType>(
    GetModelSummary,
    {
      variables: {
        id: modelID
      }
    }
  );

  const favoriteMutations = useFavoritePlan();

  const handleUpdateFavorite = (
    modelPlanID: string,
    type: UpdateFavoriteProps
  ) => {
    favoriteMutations[type]({
      variables: {
        modelPlanID
      }
    }).then(refetch);
  };

  const {
    id,
    modelName,
    isFavorite,
    modifiedDts,
    status,
    basics,
    generalCharacteristics,
    collaborators,
    isCollaborator,
    crTdls
  } = data?.modelPlan || ({} as GetModelSummaryTypes);

  const hasEditAccess: boolean =
    !isHelpArticle &&
    !isMAC(groups) &&
    (isCollaborator || isAssessment(groups, flags));

  const filteredViewOutput = (value: string) => {
    if (value === 'cmmi') {
      return groupOptions.filter(n => n.value.includes(value))[0].label;
    }
    return groupOptions
      .filter(n => n.value.includes(value))[0]
      .value.toUpperCase();
  };

  const subComponents: subComponentsProps = {
    'model-basics': {
      route: `/models/${modelID}/read-only/model-basics`,
      helpRoute: '/help-and-knowledge/sample-model-plan/model-basics',
      component: <ReadOnlyModelBasics modelID={modelID} />
    },
    'general-characteristics': {
      route: `/models/${modelID}/read-only/general-characteristics`,
      helpRoute:
        '/help-and-knowledge/sample-model-plan/general-characteristics',
      component: <ReadOnlyGeneralCharacteristics modelID={modelID} />
    },
    'participants-and-providers': {
      route: `/models/${modelID}/read-only/participants-and-providers`,
      helpRoute:
        '/help-and-knowledge/sample-model-plan/participants-and-providers',
      component: <ReadOnlyParticipantsAndProviders modelID={modelID} />
    },
    beneficiaries: {
      route: `/models/${modelID}/read-only/beneficiaries`,
      helpRoute: '/help-and-knowledge/sample-model-plan/beneficiaries',
      component: <ReadOnlyBeneficiaries modelID={modelID} />
    },
    'operations-evaluation-and-learning': {
      route: `/models/${modelID}/read-only/operations-evaluation-and-learning`,
      helpRoute:
        '/help-and-knowledge/sample-model-plan/operations-evaluation-and-learning',
      component: <ReadOnlyOpsEvalAndLearning modelID={modelID} />
    },
    payment: {
      route: `/models/${modelID}/read-only/payment`,
      helpRoute: '/help-and-knowledge/sample-model-plan/payment',
      component: <ReadOnlyPayments modelID={modelID} />
    },
    'it-solutions': {
      route: `/models/${modelID}/read-only/it-solutions`,
      component: <ReadOnlyOperationalNeeds modelID={modelID} />,
      helpRoute: '/help-and-knowledge/sample-model-plan/it-solutions'
    },
    team: {
      route: `/models/${modelID}/read-only/team`,
      helpRoute: '/help-and-knowledge/sample-model-plan/team',
      component: <ReadOnlyTeamInfo modelID={modelID} />
    },
    discussions: {
      route: `/models/${modelID}/read-only/discussions`,
      helpRoute: '/help-and-knowledge/sample-model-plan/discussions',
      component: <ReadOnlyDiscussions modelID={modelID} />
    },
    documents: {
      route: `/models/${modelID}/read-only/documents`,
      helpRoute: '/help-and-knowledge/sample-model-plan/documents',
      component: (
        <ReadOnlyDocuments modelID={modelID} isHelpArticle={isHelpArticle} />
      )
    },
    'crs-and-tdl': {
      route: `/models/${modelID}/read-only/crs-and-tdl`,
      helpRoute: '/help-and-knowledge/sample-model-plan/crs-and-tdl',
      component: (
        <ReadOnlyCRTDLs modelID={modelID} isHelpArticle={isHelpArticle} />
      )
    }
  };

  if (isHelpArticle) delete subComponents.discussions;

  if (flags.hideITLeadExperience) {
    delete subComponents['it-solutions'];
  }

  const subComponent = subComponents[subinfo];

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  if (!isSubpage(subinfo, flags, isHelpArticle)) {
    return <NotFound />;
  }

  return (
    <MainContent
      className="model-plan-read-only"
      data-testid="model-plan-read-only"
    >
      <Modal
        isOpen={isFilterViewModalOpen}
        closeModal={() => setIsFilterViewModalOpen(false)}
        shouldCloseOnOverlayClick
        modalHeading={h('filterView.text')}
      >
        <FilterViewModal
          closeModal={() => setIsFilterViewModalOpen(false)}
          filteredView={filteredView}
        />
      </Modal>

      {hasEditAccess && <ModelSubNav modelID={modelID} link="task-list" />}
      {filteredView && (
        <FilterViewBanner
          filteredView={filteredViewOutput(filteredView)}
          openFilterModal={() => setIsFilterViewModalOpen(true)}
        />
      )}

      {filteredView && (
        <FilterViewBanner
          filteredView={filteredViewOutput(filteredView)}
          openFilterModal={() => setIsFilterViewModalOpen(true)}
        />
      )}

      <SummaryBox
        heading=""
        className="padding-y-6 border-0 bg-primary-lighter margin-top-0"
        data-testid="read-only-model-summary"
      >
        <GridContainer>
          {!isHelpArticle && (
            <div className="display-flex flex-justify">
              <UswdsReactLink
                to="/models"
                className="display-flex flex-align-center margin-bottom-3"
              >
                <IconArrowBack className="text-primary margin-right-1" />
                {h('back')}
              </UswdsReactLink>

              {!isMAC(groups) && (
                <FavoriteIcon
                  isFavorite={isFavorite}
                  modelPlanID={id}
                  updateFavorite={handleUpdateFavorite}
                />
              )}
            </div>
          )}

          <PageHeading
            className="margin-0 line-height-sans-2 minh-6"
            headingLevel={isHelpArticle ? 'h2' : 'h1'}
          >
            {modelName}
          </PageHeading>

          {!isViewingFilteredGroup && (
            <ModelSummary
              descriptionRef={descriptionRef}
              goal={basics?.goal ?? ''}
              loading={loading}
              modelName={modelName}
              isDescriptionExpandable={isDescriptionExpandable}
              characteristics={generalCharacteristics}
              performancePeriodStarts={basics?.performancePeriodStarts}
              modelLeads={collaborators?.filter(
                c => c.teamRole === TeamRole.MODEL_LEAD
              )}
              crTdls={crTdls}
            />
          )}
        </GridContainer>
      </SummaryBox>
      <SectionWrapper className="model-plan-status-bar bg-base-lightest">
        <GridContainer>
          <div className="padding-y-1 status-min-height">
            <TaskListStatus
              readOnly
              modelID={modelID}
              status={status}
              statusLabel
              modifiedDts={modifiedDts ?? ''}
            />
          </div>
        </GridContainer>
      </SectionWrapper>

      <MobileNav
        subComponents={subComponents}
        subinfo={subinfo}
        isHelpArticle={isHelpArticle}
      />

      {isMobile && !flags.hideGroupView && (
        <GridContainer className="padding-y-2">
          <SideNavFilterButton
            openFilterModal={() => setIsFilterViewModalOpen(true)}
          />
        </GridContainer>
      )}

      <GridContainer className="model-plan-alert-wrapper">
        {status !== ModelStatus.CLEARED && status !== ModelStatus.ANNOUNCED && (
          <Alert type="warning" className="margin-bottom-5 desktop:margin-y-3">
            {h('alert')}
          </Alert>
        )}
      </GridContainer>

      <SectionWrapper className="model-plan__body-content margin-top-4">
        <GridContainer>
          <Grid row gap>
            {!isViewingFilteredGroup && !isMobile && (
              <Grid
                desktop={{ col: 3 }}
                className={classnames('padding-right-4 sticky-nav', {
                  'sticky-nav__collaborator': hasEditAccess
                })}
              >
                <SideNav
                  subComponents={subComponents}
                  isHelpArticle={isHelpArticle}
                  openFilterModal={() => setIsFilterViewModalOpen(true)}
                />
              </Grid>
            )}

            <Grid desktop={{ col: isViewingFilteredGroup ? 12 : 9 }}>
              <div id={`read-only-model-plan__${subinfo}-component` ?? ''}>
                <GridContainer className="padding-left-0 padding-right-0">
                  <Grid row gap>
                    {/* Central component */}
                    <Grid
                      desktop={{
                        col:
                          isViewingFilteredGroup ||
                          subinfo === 'documents' ||
                          subinfo === 'crs-and-tdl' ||
                          subinfo === 'it-solutions'
                            ? 12
                            : 8
                      }}
                    >
                      {subComponent.component}
                    </Grid>
                    {/* Contact info sidebar */}
                    {!isViewingFilteredGroup &&
                      subinfo !== 'documents' &&
                      subinfo !== 'crs-and-tdl' &&
                      subinfo !== 'it-solutions' && (
                        <Grid
                          desktop={{ col: 4 }}
                          className={classnames({
                            'sticky-nav': !isMobile,
                            'sticky-nav__collaborator': hasEditAccess
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
        </GridContainer>
      </SectionWrapper>
    </MainContent>
  );
};

export default ReadOnly;
