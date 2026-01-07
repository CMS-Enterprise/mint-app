import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';
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
    case 'NOT_STARTED':
      tagCopy = additionalQuestionnairesT(
        'questionnaireStatus.dataExchangeApproach.READY'
      );
      tagStyle = 'bg-info-light';
      break;
    case 'IN_PROGRESS':
      tagCopy = additionalQuestionnairesT(
        'questionnaireStatus.dataExchangeApproach.IN_PROGRESS'
      );
      tagStyle = 'bg-warning';
      break;
    case 'NOT_NEEDED':
      tagCopy = additionalQuestionnairesT(
        'questionnaireStatus.iddocQuestionnaire.NOT_NEEDED'
      );
      tagStyle = 'bg-white border-2px text-base';
      break;
    case 'COMPLETE':
    case 'COMPLETED':
      tagCopy = additionalQuestionnairesT(
        'questionnaireStatus.dataExchangeApproach.COMPLETE'
      );
      tagStyle = 'bg-success-dark text-white';
      break;
    default:
      tagCopy = '';
      tagStyle = 'bg-info-light';
  }

  return (
    <div
      data-testid="questionnaireList-tag"
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

  const getCtaCopy = () => {
    if (
      status === DataExchangeApproachStatus.READY ||
      status === IddocQuestionnaireStatus.NOT_STARTED
    ) {
      return additionalQuestionnairesT('questionnaireButton.start');
    }

    if (
      status === DataExchangeApproachStatus.IN_PROGRESS ||
      status === IddocQuestionnaireStatus.IN_PROGRESS
    ) {
      return additionalQuestionnairesT('questionnaireButton.continue');
    }

    if (
      status === DataExchangeApproachStatus.COMPLETE ||
      status === IddocQuestionnaireStatus.COMPLETED
    ) {
      return additionalQuestionnairesT('questionnaireButton.edit');
    }

    return null;
  };

  if (status === IddocQuestionnaireStatus.NOT_NEEDED) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        data-testid={path}
        className="usa-button margin-bottom-0 width-auto"
        onClick={() =>
          navigate(
            `/models/${modelID}/collaboration-area/additional-questionnaires/${path}`
          )
        }
        aria-label={`${getCtaCopy()} ${ariaLabel?.toLowerCase()}`}
      >
        {getCtaCopy()}
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
          <p
            className={classNames('margin-top-0', {
              'text-base-dark': status === IddocQuestionnaireStatus.NOT_NEEDED
            })}
          >
            {description}
          </p>
        </div>

        {children}
      </div>
    </li>
  );
};

export default QuestionnaireListItem;
