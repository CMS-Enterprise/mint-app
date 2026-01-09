import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  DataExchangeApproachStatus,
  GetCollaborationAreaQuery,
  IddocQuestionnaireStatus
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';

import '../cards.scss';

export type QuestionnairesType =
  GetCollaborationAreaQuery['modelPlan']['questionnaires'];

export type AdditionalQuestionnairesCardType = {
  modelID: string;
  questionnairesData: QuestionnairesType;
};

export type QuestionnairesStatusType =
  | DataExchangeApproachStatus
  | IddocQuestionnaireStatus;

const REQUIRED_QUESTIONNAIRES = ['dataExchangeApproach'];

const QuestionnaireStatusPill = ({
  status
}: {
  status: QuestionnairesStatusType;
}) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  let pillStyle;
  let pillCopy;
  switch (status) {
    case 'READY':
    case 'NOT_STARTED':
      pillCopy = collaborationAreaT(
        'additionalQuestionnairesCard.questionnaireStatus.dataExchangeApproach.READY'
      );
      pillStyle = 'bg-info-lighter text-info-darker';
      break;
    case 'IN_PROGRESS':
      pillCopy = collaborationAreaT(
        'additionalQuestionnairesCard.questionnaireStatus.dataExchangeApproach.IN_PROGRESS'
      );
      pillStyle = 'bg-warning-lighter text-warning-darker';
      break;
    case 'COMPLETE':
    case 'COMPLETED':
      pillCopy = collaborationAreaT(
        'additionalQuestionnairesCard.questionnaireStatus.dataExchangeApproach.COMPLETE'
      );
      pillStyle = 'bg-success-lighter text-success-darker';
      break;
    default:
      pillCopy = '';
      pillStyle = 'bg-info-lighter text-info-darker';
  }

  return (
    <div
      className={classNames(
        'padding-y-02 padding-x-105 radius-pill margin-right-1',
        pillStyle
      )}
    >
      {pillCopy}
    </div>
  );
};

const AdditionalQuestionnairesCard = ({
  modelID,
  questionnairesData
}: AdditionalQuestionnairesCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const navigate = useNavigate();

  const { __typename, ...questionnaires } = questionnairesData;

  const questionnaireNames = Object.keys(
    questionnaires
  ) as (keyof typeof questionnaires)[];

  const allQuestionnaires = questionnaireNames.reduce<{
    requiredQuestionnaires: (typeof questionnaires)[keyof typeof questionnaires][];
    otherQuestionnaires: (typeof questionnaires)[keyof typeof questionnaires][];
  }>(
    (groupedQuestionnaires, name) => {
      const questionnaire = questionnaires[name];

      if (
        REQUIRED_QUESTIONNAIRES.includes(name) ||
        ('needed' in questionnaire && questionnaire.needed)
      ) {
        groupedQuestionnaires.requiredQuestionnaires.push(questionnaire);
      } else {
        groupedQuestionnaires.otherQuestionnaires.push(questionnaire);
      }
      return groupedQuestionnaires;
    },
    {
      requiredQuestionnaires: [],
      otherQuestionnaires: []
    }
  );

  const requiredQuestionnairesCount =
    allQuestionnaires.requiredQuestionnaires.length;

  const otherQuestionnairesCount = allQuestionnaires.otherQuestionnaires.length;

  return (
    <>
      <Card
        gridLayout={{ desktop: { col: 6 } }}
        className="collaboration-area__card collaboration-area__main-card"
      >
        <CardHeader>
          <h3 className="usa-card__heading">
            {collaborationAreaT('additionalQuestionnairesCard.heading')}
          </h3>
        </CardHeader>

        <CardBody>
          <h4 className="text-bold margin-top-0 margin-bottom-2 line-height-body-2">
            {collaborationAreaT(
              'additionalQuestionnairesCard.requiredQuestionnairesCount',
              { count: requiredQuestionnairesCount }
            )}
          </h4>

          {/* questionnaires status */}
          <div className="margin-bottom-2">
            {allQuestionnaires.requiredQuestionnaires.map(
              requiredQuestionnaire => (
                <div className="display-flex flex-align-center margin-bottom-1">
                  <QuestionnaireStatusPill
                    status={requiredQuestionnaire.status}
                  />
                  <p className="margin-y-0">
                    {additionalQuestionnairesT(
                      `questionnairesList.${
                        requiredQuestionnaire.__typename ===
                        'PlanDataExchangeApproach'
                          ? 'dataExchangeApproach'
                          : 'iddocQuestionnaire'
                      }.heading`
                    )}
                  </p>
                </div>
              )
            )}
          </div>

          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area/additional-questionnaires`}
            data-testid="view-all-required-questionnaires"
            className="deep-underline"
          >
            {collaborationAreaT('additionalQuestionnairesCard.viewAllRequired')}
            <Icon.ArrowForward
              className="top-3px margin-left-05"
              aria-label="forward"
            />
          </UswdsReactLink>
        </CardBody>

        <CardBody className="padding-y-3 flex-none">
          <h4 className="display-inline-block text-bold margin-y-0 margin-right-2 line-height-body-2">
            {collaborationAreaT(
              'additionalQuestionnairesCard.otherQuestionnairesCount',
              { count: otherQuestionnairesCount }
            )}
          </h4>

          {otherQuestionnairesCount > 0 && (
            <UswdsReactLink
              to={`/models/${modelID}/collaboration-area/additional-questionnaires`}
              data-testid="view-data-exchange-help-article"
              className="deep-underline"
            >
              {collaborationAreaT(
                'additionalQuestionnairesCard.viewAllQuestionnaires'
              )}
              <Icon.ArrowForward
                className="top-3px margin-left-05"
                aria-label="forward"
              />
            </UswdsReactLink>
          )}
        </CardBody>

        <CardFooter>
          <Button
            type="button"
            className="margin-right-2"
            onClick={() =>
              navigate(
                `/models/${modelID}/collaboration-area/additional-questionnaires`
              )
            }
            data-testid="to-data-exchange-approach"
          >
            {collaborationAreaT(
              'additionalQuestionnairesCard.goToQuestionnaires'
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default AdditionalQuestionnairesCard;
