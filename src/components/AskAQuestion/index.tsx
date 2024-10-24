import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import Discussions from 'features/ModelPlan/Discussions';
import DiscussionModalWrapper from 'features/ModelPlan/Discussions/DiscussionModalWrapper';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

type AskAQuestionType = {
  modelID: string;
  renderTextFor?: 'need' | 'solution' | 'status' | 'dataExchangeApproach';
  inlineText?: boolean;
  className?: string;
};

const AskAQuestion = ({
  modelID,
  renderTextFor,
  inlineText,
  className
}: AskAQuestionType) => {
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');
  const { t: opSolutionsMiscT } = useTranslation('opSolutionsMisc');
  const { t: dataExchangeApproachT } = useTranslation(
    'dataExchangeApproachMisc'
  );
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);

  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  const renderText = (text: string | undefined) => {
    switch (text) {
      case 'need':
        return opSolutionsMiscT('notSureWhatToDoNext');
      case 'status':
        return opSolutionsMiscT('helpTiming');
      case 'dataExchangeApproach':
        return dataExchangeApproachT('needHelpDiscussion');
      case 'solution':
      default:
        return opSolutionsMiscT('helpChoosing');
    }
  };

  return (
    <div className={className}>
      {isDiscussionOpen && (
        <DiscussionModalWrapper
          isOpen={isDiscussionOpen}
          closeModal={() => setIsDiscussionOpen(false)}
        >
          <Discussions modelID={modelID} askAQuestion />
        </DiscussionModalWrapper>
      )}

      <div
        className={classNames('padding-2 bg-primary-lighter', {
          'display-flex flex-justify flex-align-center': inlineText && !isMobile
        })}
      >
        {renderTextFor && (
          <p
            className={classNames('text-bold margin-top-0', {
              'margin-0': inlineText && !isMobile
            })}
          >
            {renderText(renderTextFor)}
          </p>
        )}

        <div className="display-flex" data-testid="ask-a-question">
          <Icon.Announcement className="text-primary margin-right-1" />

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
