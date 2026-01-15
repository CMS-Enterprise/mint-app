import React, { Fragment, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import {
  GetAllQuestionnairesQuery,
  GetLockedModelPlanSectionsQuery,
  LockableSection,
  useGetAllQuestionnairesQuery
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import SectionLock from 'components/SectionLock';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import { SubscriptionContext } from 'contexts/PageLockContext';
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

const AdditionalQuestionnaires = () => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { euaId } = useSelector((state: AppState) => state.auth);

  const { lockableSectionLocks } = useContext(SubscriptionContext);

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading } = useGetAllQuestionnairesQuery({
    variables: {
      id: modelID
    }
  });

  const questionnaireSections = useMemo(() => {
    if (!data || !data.modelPlan) {
      return {} as GetAllQuestionnairesQuery['modelPlan']['questionnaires'];
    }
    const { __typename, ...questionnaire } = data.modelPlan.questionnaires;
    return questionnaire;
  }, [data]);

  const questionnaireNames = Object.keys(
    questionnaireSections
  ) as (keyof typeof questionnaireSections)[];

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
              {questionnaireNames.map((key, index) => {
                const lockedStatus = getQuestionnaireLockedStatus(key);

                return (
                  <Fragment key={key}>
                    <QuestionnaireListItem
                      key={key}
                      testId={`questionnaire-list-intake-form-${key}`}
                      heading={additionalQuestionnairesT(
                        `questionnairesList.${key}.heading`
                      )}
                      description={additionalQuestionnairesT(
                        `questionnairesList.${key}.description`
                      )}
                      lastUpdated={
                        questionnaireSections[key].modifiedDts &&
                        formatDateLocal(
                          questionnaireSections[key].modifiedDts!,
                          'MM/dd/yyyy'
                        )
                      }
                      status={questionnaireSections[key].status}
                    >
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
                        status={questionnaireSections[key].status}
                      />

                      {questionnaireSectionMap[key] && (
                        <SectionLock section={questionnaireSectionMap[key]} />
                      )}
                    </QuestionnaireListItem>
                    {index < questionnaireNames.length - 1 && (
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
