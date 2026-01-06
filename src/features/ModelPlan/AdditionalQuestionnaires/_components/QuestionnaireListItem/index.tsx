import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import {
  DataExchangeApproachStatus,
  IddocQuestionnaireStatus
} from 'gql/generated/graphql';

import '../../index.scss';

const QuestionnaireListStatusTag = ({
  status,
  classname
}: {
  status: DataExchangeApproachStatus | IddocQuestionnaireStatus;
  classname?: string;
}) => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  let tagStyle;
  let tagCopy;
  switch (status) {
    case 'READY':
      tagCopy = additionalQuestionnairesT('questionnaireStatus.NOT_STARTED');
      tagStyle = 'bg-info-light';
      break;
    case 'IN_PROGRESS':
      tagCopy = additionalQuestionnairesT('questionnaireStatus.IN_PROGRESS');
      tagStyle = 'bg-warning';
      break;
    case 'NOT_NEEDED':
      tagCopy = additionalQuestionnairesT('questionnaireStatus.NOT_NEEDED');
      tagStyle = 'bg-white border-2px text-base';
      break;
    case 'COMPLETE':
      tagCopy = additionalQuestionnairesT('questionnaireStatus.COMPLETE');
      tagStyle = 'bg-success-dark text-white';
      break;
    default:
      tagCopy = '';
      tagStyle = 'bg-info-light';
  }

  return (
    <div
      data-testid="questionnairelist-tag"
      className={`additional-questionnaires-list__task-tag line-height-body-1 text-bold ${tagStyle} ${
        classname ?? ''
      }`}
    >
      <span>{tagCopy}</span>
    </div>
  );
};

export const QuestionnaireListButton = ({
  ariaLabel,
  path,
  disabled,
  status
}: {
  ariaLabel?: string;
  path: string;
  disabled?: boolean;
  status: DataExchangeApproachStatus | IddocQuestionnaireStatus;
}) => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );
  const { modelID = '' } = useParams<{ modelID: string }>();
  const navigate = useNavigate();

  const ctaCopy = () => {
    if (status === DataExchangeApproachStatus.READY) {
      return additionalQuestionnairesT('questionnaireButton.start');
    }

    if (status === 'IN_PROGRESS') {
      return additionalQuestionnairesT('questionnaireButton.continue');
    }

    return '';
  };

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        data-testid={path}
        className="usa-button margin-bottom-2 width-auto"
        onClick={() =>
          navigate(
            `/models/${modelID}/collaboration-area/additional-questionnaires/${path}`
          )
        }
        aria-label={`${ctaCopy()} ${ariaLabel?.toLowerCase()}`}
      >
        {ctaCopy()}
      </Button>
    </>
  );
};

type QuestionnaireListItemProps = {
  children?: React.ReactNode;
  heading: string;
  description: string;
  status: DataExchangeApproachStatus | IddocQuestionnaireStatus;
  testId: string;
  lastUpdated?: string | null;
};

const QuestionnaireListItem = ({
  children,
  heading,
  description,
  status,
  testId,
  lastUpdated
}: QuestionnaireListItemProps) => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  return (
    <li className="display-flex padding-bottom-4" data-testid={testId}>
      <div className="width-full">
        <div className="additional-questionnaires-list__task-row display-flex flex-justify flex-align-start">
          <h3 className="margin-top-0 margin-bottom-1">{heading}</h3>
          <span className="display-flex flex-column flex-align-end">
            <QuestionnaireListStatusTag status={status} />
            <div className="additional-questionnaires-list__last-updated-status line-height-body-4 text-base">
              {lastUpdated && (
                <p className="margin-y-0">
                  {additionalQuestionnairesT('lastUpdated')}
                </p>
              )}
              <p className="margin-y-0">{lastUpdated}</p>
            </div>
          </span>
        </div>

        <div className="additional-questionnaires-list__task-description margin-right-auto line-height-body-5">
          <p className="margin-top-0">{description}</p>
        </div>

        {children}
      </div>
    </li>
  );
};

export default QuestionnaireListItem;
