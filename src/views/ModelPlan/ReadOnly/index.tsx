import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Grid,
  GridContainer,
  IconArrowBack,
  IconExpandMore,
  SummaryBox
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import { FavoriteIcon } from 'components/FavoriteCard';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import ModelSubNav from 'components/ModelSubNav';
import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import SectionWrapper from 'components/shared/SectionWrapper';
import SAMPLE_MODEL_UUID_STRING from 'constants/sampleModelPlan';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useFavoritePlan from 'hooks/useFavoritePlan';
import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import {
  GetModelSummary as GetModelSummaryType,
  GetModelSummary_modelPlan as GetModelSummaryTypes,
  GetModelSummary_modelPlan_crTdls as CRTDLsTypes
} from 'queries/ReadOnly/types/GetModelSummary';
import { ModelStatus, TeamRole } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import { translateKeyCharacteristics } from 'utils/modelPlan';
import { isAssessment } from 'utils/user';
import NotFound, { NotFoundPartial } from 'views/NotFound';

import { UpdateFavoriteProps } from '../ModelPlanOverview';
import TaskListStatus from '../TaskList/_components/TaskListStatus';

import ContactInfo from './_components/ContactInfo';
import MobileNav from './_components/MobileNav';
import SideNav from './_components/Sidenav';
import ReadOnlyGeneralCharacteristics from './GeneralCharacteristics/index';
import ReadOnlyModelBasics from './ModelBasics/index';
import ReadOnlyParticipantsAndProviders from './ParticipantsAndProviders/index';
import ReadOnlyBeneficiaries from './Beneficiaries';
import ReadOnlyCRTDLs from './CRTDLs';
import ReadOnlyDiscussions from './Discussions';
import ReadOnlyDocuments from './Documents';
import ReadOnlyOperationalNeeds from './OperationalNeeds';
import ReadOnlyPayments from './Payments';
import ReadOnlyTeamInfo from './Team';

import './index.scss';

type subComponentProps = {
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
  'it-tools',
  'team',
  'discussions',
  'documents',
  'crs-and-tdl'
];

export type SubpageKey = typeof listOfSubpageKey[number];
const isSubpage = (x: SubpageKey, isHelpArticle?: boolean): boolean => {
  if (isHelpArticle) {
    return listOfSubpageKey
      .filter(subpage => subpage !== 'discussions')
      .includes(x);
  }
  return listOfSubpageKey.includes(x);
};

const ReadOnly = ({ isHelpArticle }: { isHelpArticle?: boolean }) => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('generalReadOnly');
  const isMobile = useCheckResponsiveScreen('tablet');
  const {
    modelID = isHelpArticle ? SAMPLE_MODEL_UUID_STRING : '',
    subinfo
  } = useParams<{
    modelID: string;
    subinfo: SubpageKey;
  }>();

  // Usered to check if user is assessment for rendering subnav to task list
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);

  const descriptionRef = React.createRef<HTMLElement>();
  const [
    isDescriptionExpandable,
    setIsDescriptionExpandable
  ] = useState<boolean>(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(
    false
  );

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
    !isHelpArticle && (isCollaborator || isAssessment(groups));

  const formattedApplicationStartDate =
    basics?.applicationsStart && formatDate(basics?.applicationsStart);

  const formattedKeyCharacteristics = generalCharacteristics?.keyCharacteristics.map(
    (item, index) => {
      return `${translateKeyCharacteristics(item)}${
        index === generalCharacteristics?.keyCharacteristics.length - 1
          ? ''
          : ', '
      }`;
    }
  );

  const formattedModelLeads = collaborators
    ?.filter(c => c.teamRole === TeamRole.MODEL_LEAD)
    .map((collaborator, index) => {
      return `${collaborator.fullName}${
        index ===
        collaborators.filter(c => c.teamRole === TeamRole.MODEL_LEAD).length - 1
          ? ''
          : ', '
      }`;
    });

  const formattedCrTdls = (items: CRTDLsTypes[]) => {
    const idNumbers = items.map(item => item.idNumber);
    if (idNumbers.length > 3) {
      return `${idNumbers.slice(0, 3).join(', ')} +${idNumbers.length - 3} ${t(
        'more'
      )}`;
    }
    return idNumbers.join(', ');
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
      component: <h1>operationsEvaluationAndLearning</h1>
    },
    payment: {
      route: `/models/${modelID}/read-only/payment`,
      helpRoute: '/help-and-knowledge/sample-model-plan/payment',
      component: <ReadOnlyPayments modelID={modelID} />
    },
    'it-tools': {
      route: `/models/${modelID}/read-only/it-tools`,
      component: <ReadOnlyOperationalNeeds modelID={modelID} />,
      helpRoute: '/help-and-knowledge/sample-model-plan/it-tools'
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

  const subComponent = subComponents[subinfo];

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  if (!isSubpage(subinfo, isHelpArticle)) {
    return <NotFound />;
  }

  return (
    <MainContent
      className="model-plan-read-only"
      data-testid="model-plan-read-only"
    >
      {hasEditAccess && <ModelSubNav modelID={modelID} link="task-list" />}

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

              <FavoriteIcon
                isFavorite={isFavorite}
                modelPlanID={id}
                updateFavorite={handleUpdateFavorite}
              />
            </div>
          )}

          <PageHeading
            className="margin-0 line-height-sans-2 minh-6"
            headingLevel={isHelpArticle ? 'h2' : 'h1'}
          >
            {modelName}
          </PageHeading>

          <CollapsableLink
            className="margin-top-3 padding-0"
            eyeIcon
            startOpen
            labelPosition="bottom"
            closeLabel={h('hideSummary')}
            styleLeftBar={false}
            id={`${modelName?.replace(/\s+/g, '-').toLowerCase()}--description`}
            label={h('showSummary')}
          >
            <div
              className={classnames(
                'description-truncated',
                'margin-bottom-2',
                {
                  expanded: descriptionExpanded
                }
              )}
            >
              <DescriptionDefinition
                definition={basics?.goal ?? ''}
                ref={descriptionRef}
                dataTestId="read-only-model-summary__description"
                className={classnames(
                  'font-body-lg line-height-body-5 text-light',
                  {
                    'minh-5': loading || basics?.goal
                  }
                )}
              />
              {isDescriptionExpandable && (
                <div>
                  <Button
                    unstyled
                    type="button"
                    className="margin-top-1"
                    onClick={() => {
                      setDescriptionExpanded(!descriptionExpanded);
                    }}
                  >
                    {h(
                      descriptionExpanded
                        ? 'description.less'
                        : 'description.more'
                    )}
                    <IconExpandMore className="expand-icon margin-left-05 margin-bottom-2px text-tbottom" />
                  </Button>
                </div>
              )}
            </div>
            <Grid row className="margin-top-3">
              <Grid col={6} className="margin-bottom-2 minh-7">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.keyCharacteristics')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term={
                    generalCharacteristics?.keyCharacteristics.length !== 0
                      ? formattedKeyCharacteristics
                      : t('noAnswer.noneEntered')
                  }
                />
              </Grid>
              <Grid col={6} className="margin-bottom-2 minh-7">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.modelLeads')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term={formattedModelLeads}
                />
              </Grid>
              <Grid
                col={6}
                className="margin-bottom-2 desktop:margin-bottom-0 minh-7"
              >
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.modelStartDate')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term={formattedApplicationStartDate ?? t('noAnswer.tBD')}
                />
              </Grid>
              <Grid
                col={6}
                className="margin-bottom-2 desktop:margin-bottom-0 minh-7"
              >
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.crAndTdls')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0 "
                  term={
                    crTdls && crTdls.length !== 0
                      ? formattedCrTdls(crTdls)
                      : t('noAnswer.noneEntered')
                  }
                />
              </Grid>
            </Grid>
          </CollapsableLink>
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

      <SectionWrapper className="model-plan-alert-wrapper">
        {status !== ModelStatus.CLEARED && status !== ModelStatus.ANNOUNCED && (
          <Alert type="warning" className="margin-bottom-5 desktop:margin-y-3">
            {h('alert')}
          </Alert>
        )}
      </SectionWrapper>

      <SectionWrapper className="model-plan__body-content margin-top-4">
        <GridContainer>
          <Grid row gap>
            {!isMobile && (
              <Grid
                desktop={{ col: 3 }}
                className={classnames('padding-right-4 sticky-nav', {
                  'sticky-nav__collaborator': hasEditAccess
                })}
              >
                <SideNav
                  subComponents={subComponents}
                  isHelpArticle={isHelpArticle}
                />
              </Grid>
            )}

            <Grid desktop={{ col: 9 }}>
              <div id={`read-only-model-plan__${subinfo}-component` ?? ''}>
                <GridContainer className="padding-left-0 padding-right-0">
                  <Grid row gap>
                    {/* Central component */}
                    <Grid
                      desktop={{
                        col:
                          subinfo === 'documents' ||
                          subinfo === 'crs-and-tdl' ||
                          subinfo === 'it-tools'
                            ? 12
                            : 8
                      }}
                    >
                      {subComponent.component}
                    </Grid>
                    {/* Contact info sidebar */}
                    {subinfo !== 'documents' &&
                      subinfo !== 'crs-and-tdl' &&
                      subinfo !== 'it-tools' && (
                        <Grid
                          desktop={{ col: 4 }}
                          className={classnames({
                            'sticky-nav': !isMobile,
                            'sticky-nav__collaborator': hasEditAccess
                          })}
                        >
                          <ContactInfo modelID={modelID} />
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
