import React, { Fragment, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import {
  GetLockedModelPlanSectionsQuery,
  LockableSection,
  useGetAllQuestionnairesQuery
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import { Avatar } from 'components/Avatar';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import SectionLock from 'components/SectionLock';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import { SubscriptionContext } from 'contexts/PageLockContext';
import { QuestionnaireName } from 'types/questionnaires';
import { formatDateLocal } from 'utils/date';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import QuestionnaireListItem, {
  QuestionnaireListButton
} from './_components/QuestionnaireListItem';
import QuestionnairesSideNav from './_components/QuestionnairesSideNav';

type QuestionnaireSectionLockStatus =
  GetLockedModelPlanSectionsQuery['lockableSectionLocks'][0];

const questionnaireSectionMap: Partial<Record<string, LockableSection>> = {
  dataExchangeApproach: LockableSection.DATA_EXCHANGE_APPROACH,
  iddocQuestionnaire: LockableSection.IDDOC_QUESTIONNAIRE
};

const QUESTIONNAIRE_DISPLAY_ORDER = [
  'dataExchangeApproach',
  'iddocQuestionnaire'
] as const satisfies QuestionnaireName[];

const AdditionalQuestionnaires = () => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { euaId } = useSelector((state: AppState) => state.auth);

  const { lockableSectionLocks } = useContext(SubscriptionContext);

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllQuestionnairesQuery({
    variables: {
      id: modelID
    }
  });

  const questionnaireSections = data?.modelPlan?.questionnaires;

  const getQuestionnaireLockedStatus = (
    section: string
  ): QuestionnaireSectionLockStatus | undefined => {
    return lockableSectionLocks.find(
      sectionLock => sectionLock.section === questionnaireSectionMap[section]
    );
  };

  if (loading) {
    return <PageLoading />;
  }

  if (error || !questionnaireSections) {
    return <NotFound />;
  }

  // Helper to get the correct status field based on questionnaire type
  const getQuestionnaireStatus = (key: QuestionnaireName) => {
    const questionnaire = questionnaireSections[key];
    // iddocQuestionnaire uses taskListStatus to include needed, others use status
    if ('taskListStatus' in questionnaire) {
      return questionnaire.taskListStatus;
    }
    return questionnaire.status;
  };

  return (
    <MainContent
      className="additional-questionnaires-list"
      data-testid="additional-questionnaires-list"
    >
      <GridContainer>
        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.ADDITIONAL_QUESTIONNAIRES
          ]}
        />

        <Grid row gap>
          <Grid desktop={{ col: 9 }} tablet={{ col: 9 }}>
            <PageHeading className="margin-top-4 margin-bottom-0">
              {additionalQuestionnairesT('heading')}
            </PageHeading>
            <p
              className="margin-y-0 font-body-lg line-height-sans-5"
              data-testid="model-plan-name"
            >
              {miscellaneousT('for')} {modelName}
            </p>

            <div className="padding-y-1 ">
              <UswdsReactLink
                to={`/models/${modelID}/collaboration-area`}
                data-testid="return-to-collaboration"
              >
                <span>
                  <Icon.ArrowBack
                    className="top-3px margin-right-1"
                    aria-label="back"
                  />
                  {additionalQuestionnairesT('returnToCollaboration')}
                </span>
              </UswdsReactLink>
            </div>
            <ol
              data-testid="questionnaire-list"
              className="margin-top-6 margin-bottom-0 padding-left-0"
            >
              {QUESTIONNAIRE_DISPLAY_ORDER.map((key, index) => {
                const lockedStatus = getQuestionnaireLockedStatus(key);

                return (
                  <Fragment key={key}>
                    <QuestionnaireListItem
                      questionnaireName={key}
                      status={getQuestionnaireStatus(key)}
                    >
                      {questionnaireSections[key].modifiedDts &&
                        questionnaireSections[key].modifiedByUserAccount && (
                          <div
                            data-testid="most-recent-edit"
                            className="display-flex flex-align-center margin-top-1 margin-bottom-2"
                          >
                            <span className="text-base margin-right-1">
                              {additionalQuestionnairesT('mostRecentEdit', {
                                date: formatDateLocal(
                                  questionnaireSections[key].modifiedDts,
                                  'MM/dd/yyyy'
                                )
                              })}
                            </span>

                            <Avatar
                              className="text-base-darkest"
                              user={
                                questionnaireSections[key].modifiedByUserAccount
                                  .commonName
                              }
                            />
                          </div>
                        )}

                      <div className="display-flex flex-align-center">
                        <QuestionnaireListButton
                          ariaLabel={additionalQuestionnairesT(
                            `questionnairesList.${key}.heading`
                          )}
                          testId={`${convertCamelCaseToKebabCase(key)}-button`}
                          path={additionalQuestionnairesT(
                            `questionnairesList.${key}.path`
                          )}
                          disabled={
                            lockedStatus !== undefined &&
                            lockedStatus.lockedByUserAccount.username !== euaId
                          }
                          status={getQuestionnaireStatus(key)}
                        />

                        {questionnaireSectionMap[key] && (
                          <SectionLock section={questionnaireSectionMap[key]} />
                        )}
                      </div>
                    </QuestionnaireListItem>
                    {index < QUESTIONNAIRE_DISPLAY_ORDER.length - 1 && (
                      <Divider className="margin-bottom-4" />
                    )}
                  </Fragment>
                );
              })}
            </ol>
          </Grid>

          <Grid desktop={{ col: 3 }} tablet={{ col: 3 }}>
            <QuestionnairesSideNav />
          </Grid>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default AdditionalQuestionnaires;
