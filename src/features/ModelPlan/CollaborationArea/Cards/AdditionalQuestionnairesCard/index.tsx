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

import UswdsReactLink from 'components/LinkWrapper';
import {
  Questionnaire,
  QuestionnaireName,
  QuestionnairesStatusType,
  QuestionnairesType
} from 'types/questionnaires';

import '../cards.scss';

type QuestionnaireRow = {
  name: QuestionnaireName;
  questionnaire: Questionnaire;
};

export type AdditionalQuestionnairesCardType = {
  modelID: string;
  questionnairesData: QuestionnairesType;
};

const REQUIRED_QUESTIONNAIRES: QuestionnaireName[] = ['dataExchangeApproach'];

const QuestionnaireStatusPill = ({
  status
}: {
  status: QuestionnairesStatusType;
}) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  let pillStyle;
  let pillCopy;
  switch (status) {
    case 'NOT_NEEDED':
      pillCopy = collaborationAreaT(
        'additionalQuestionnairesCard.questionnaireStatus.iddocQuestionnaire.NOT_NEEDED'
      );
      pillStyle = 'bg-base-lighter text-base-darker';
      break;
    case 'READY':
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
  questionnairesData: { __typename, ...questionnaires }
}: AdditionalQuestionnairesCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const navigate = useNavigate();

  const questionnaireNames = Object.keys(questionnaires) as QuestionnaireName[];

  const allQuestionnaires = questionnaireNames.reduce<{
    requiredQuestionnaires: QuestionnaireRow[];
    otherQuestionnaires: QuestionnaireRow[];
  }>(
    (groupedQuestionnaires, name) => {
      const questionnaire = questionnaires[name];

      const isRequired =
        REQUIRED_QUESTIONNAIRES.includes(name) ||
        ('needed' in questionnaire && questionnaire.needed);

      if (isRequired) {
        groupedQuestionnaires.requiredQuestionnaires.push({
          name,
          questionnaire
        });
      } else {
        groupedQuestionnaires.otherQuestionnaires.push({ name, questionnaire });
      }

      return groupedQuestionnaires;
    },
    { requiredQuestionnaires: [], otherQuestionnaires: [] }
  );

  const { requiredQuestionnaires, otherQuestionnaires } = allQuestionnaires;

  const requiredQuestionnairesCount = requiredQuestionnaires.length;
  const otherQuestionnairesCount = otherQuestionnaires.length;

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
            {requiredQuestionnaires.map(({ name, questionnaire }) => {
              const status =
                'taskListStatus' in questionnaire
                  ? questionnaire.taskListStatus
                  : questionnaire.status;

              return (
                <div
                  className="display-flex flex-align-center margin-bottom-1"
                  key={questionnaire.id}
                >
                  <QuestionnaireStatusPill status={status} />
                  <p className="margin-y-0">
                    {additionalQuestionnairesT(
                      `questionnairesList.${name}.heading`
                    )}
                  </p>
                </div>
              );
            })}
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
