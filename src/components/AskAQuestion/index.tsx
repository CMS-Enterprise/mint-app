import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconAnnouncement } from '@trussworks/react-uswds';

import Discussions from 'views/ModelPlan/Discussions';

type AskAQuestionType = {
  modelID: string;
};

const AskAQuestion = ({ modelID }: AskAQuestionType) => {
  const { t } = useTranslation('discussions');
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);

  return (
    <>
      {isDiscussionOpen && (
        <Discussions
          modelID={modelID}
          askAQuestion
          isOpen={isDiscussionOpen}
          closeModal={() => setIsDiscussionOpen(false)}
        />
      )}
      <div
        className="padding-2 bg-primary-lighter display-flex"
        data-testid="ask-a-question"
      >
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
    </>
  );
};

export default AskAQuestion;
