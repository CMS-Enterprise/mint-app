import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import Discussions from 'features/ModelPlan/Discussions';
import DiscussionModalWrapper from 'features/ModelPlan/Discussions/DiscussionModalWrapper';

type AskAQuestionType = {
  modelID: string;
  renderTextFor?:
    | 'need'
    | 'solution'
    | 'status'
    | 'dataExchangeApproach'
    | 'modelToOperations';
  className?: string;
};

const AskAQuestion = ({
  modelID,
  renderTextFor,
  className
}: AskAQuestionType) => {
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');
  const { t: opSolutionsMiscT } = useTranslation('opSolutionsMisc');
  const { t: dataExchangeApproachT } = useTranslation(
    'dataExchangeApproachMisc'
  );
  const { t: modelToOperationsT } = useTranslation('modelToOperationsMisc');

  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);

  const renderText = (text: string | undefined) => {
    switch (text) {
      case 'need':
        return opSolutionsMiscT('notSureWhatToDoNext');
      case 'status':
        return opSolutionsMiscT('helpTiming');
      case 'dataExchangeApproach':
        return dataExchangeApproachT('needHelpDiscussion');
      case 'modelToOperations':
        return modelToOperationsT('needHelpDiscussion');
      case 'solution':
      default:
        return opSolutionsMiscT('helpChoosing');
    }
  };

  return (
    <div className={className}>
      <DiscussionModalWrapper
        isOpen={isDiscussionOpen}
        closeModal={() => setIsDiscussionOpen(false)}
      >
        <Discussions modelID={modelID} askAQuestion />
      </DiscussionModalWrapper>

      <div
        className={classNames(
          'padding-2 bg-primary-lighter display-flex flex-wrap flex-justify flex-align-center',
          {
            'padding-bottom-205': renderTextFor === 'modelToOperations'
          }
        )}
        style={{ gap: '1rem' }}
      >
        {renderTextFor && (
          <p className="text-bold margin-0">{renderText(renderTextFor)}</p>
        )}

        <div className="display-flex" data-testid="ask-a-question">
          <Icon.Announcement
            className="text-primary margin-right-1"
            aria-label="announcement"
          />

          <Button
            type="button"
            data-testid="ask-a-question-button"
            unstyled
            onClick={() => {
              // Send a discussion open event to GA
              ReactGA.send({
                hitType: 'event',
                eventCategory: 'discussion_center_opened',
                eventAction: 'click',
                eventLabel: 'Discussion Center opened'
              });

              setIsDiscussionOpen(true);
            }}
          >
            {discussionsMiscT('askAQuestionLink')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AskAQuestion;
