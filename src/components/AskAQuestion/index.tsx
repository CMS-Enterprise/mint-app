import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconAnnouncement } from '@trussworks/react-uswds';

import Discussions from 'views/ModelPlan/Discussions';
import DiscussionModalWrapper from 'views/ModelPlan/Discussions/DiscussionModalWrapper';

type AskAQuestionType = {
  modelID: string;
  opNeeds?: boolean;
};

const AskAQuestion = ({ modelID, opNeeds }: AskAQuestionType) => {
  const { t } = useTranslation('discussions');
  const { t: o } = useTranslation('itSolutions');
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);

  return (
    <>
      {isDiscussionOpen && (
        <DiscussionModalWrapper
          isOpen={isDiscussionOpen}
          closeModal={() => setIsDiscussionOpen(false)}
        >
          <Discussions modelID={modelID} askAQuestion />
        </DiscussionModalWrapper>
      )}

      <div className="padding-2 bg-primary-lighter">
        {opNeeds && (
          <p className="text-bold margin-top-0">{o('helpChoosing')}</p>
        )}

        <div className="display-flex" data-testid="ask-a-question">
          <IconAnnouncement className="text-primary margin-right-1" />

          <Button
            type="button"
            data-testid="ask-a-question-button"
            unstyled
            onClick={() => setIsDiscussionOpen(true)}
          >
            {t('askAQuestionLink')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AskAQuestion;
