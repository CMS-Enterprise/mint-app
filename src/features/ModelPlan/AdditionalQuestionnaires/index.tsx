import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import {
  GetAllQuestionnairesQuery,
  LockableSection,
  useGetAllQuestionnairesQuery
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import useSectionLock from 'hooks/useSectionLock';
// import dataExchangeApproach from 'i18n/en-US/modelPlan/dataExchangeApproach';
import { formatDateLocal } from 'utils/date';

import QuestionnaireListItem, {
  QuestionnaireListButton
} from './_components/QuestionnaireListItem';
import QuestionnairesSideNav from './_components/QuestionnairesSideNav';

type DataExchangeApproachType =
  GetAllQuestionnairesQuery['modelPlan']['dataExchangeApproach'];

type QuestionnaireSections = { [key: string]: DataExchangeApproachType };

const questionnaireSectionMap: Partial<Record<string, LockableSection>> = {
  dataExchangeApproach: LockableSection.DATA_EXCHANGE_APPROACH
};

const AdditionalQuestionnaires = () => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { modelID = '' } = useParams<{ modelID: string }>();

  const { SectionLock, isLocked } = useSectionLock({
    section: LockableSection.DATA_EXCHANGE_APPROACH
  });

  const { data, loading } = useGetAllQuestionnairesQuery({
    variables: {
      id: modelID
    }
  });

  const modelPlan =
    data?.modelPlan ||
    ({
      __typename: 'ModelPlan',
      id: '00000000-0000-0000-0000-000000000005',
      modelName: 'Test Model Plan for MTO testing',
      abbreviation: 'TMTO',
      createdDts: '2026-01-05T22:55:26.923527Z',
      dataExchangeApproach: {
        __typename: 'PlanDataExchangeApproach',
        id: 'b4eead7a-6603-41ed-85b7-97f1b1f0b367',
        modifiedDts: '2026-01-05T22:55:26.923527Z',
        modifiedByUserAccount: null,
        status: 'READY'
      }
    } as GetAllQuestionnairesQuery['modelPlan']);

  const { dataExchangeApproach } = modelPlan;

  const questionnaireSections: QuestionnaireSections = {
    dataExchangeApproach
  };

  //   const { modifiedDts, modifiedByUserAccount, status } =
  //     dataExhangeApproachData;

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

        {/* {modifiedDts && modifiedByUserAccount && !isLocked && (
        <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-3 flex-align-center">
          <span className="text-base margin-right-1">
            {collaborationAreaT('additionalQuestionnairesCard.lastModified', {
              date: formatDateLocal(modifiedDts, 'MM/dd/yyyy')
            })}
          </span>
          <Avatar
            className="text-base-darkest"
            user={modifiedByUserAccount.commonName}
          />
        </div>
      )} */}

        <Grid row gap>
          <Grid desktop={{ col: 9 }} tablet={{ col: 9 }}>
            <PageHeading className="margin-top-4 margin-bottom-0">
              {additionalQuestionnairesT('heading')}
            </PageHeading>
            <p
              className="margin-y-0 font-body-lg line-height-sans-5"
              data-testid="model-plan-name"
            >
              {miscellaneousT('for')} modelName (abbreviation)
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
              {Object.keys(questionnaireSections).map((key: string) => {
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
                        path={additionalQuestionnairesT(
                          `questionnairesList.${key}.path`
                        )}
                        disabled={isLocked}
                        status={questionnaireSections[key].status}
                      />

                      {questionnaireSectionMap[key] && <SectionLock />}
                    </QuestionnaireListItem>
                    {key !== 'prepareForClearance' && (
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
