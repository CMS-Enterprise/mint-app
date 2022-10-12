import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Discussions from 'views/ModelPlan/Discussions';
import DiscussionModalWrapper from 'views/ModelPlan/Discussions/DiscussionModalWrapper';

const ReadOnlyDiscussions = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('discussions');
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(true);

  return (
    <div
      className="read-only-model-plan--discussions"
      data-testid="read-only-model-plan--discussions"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
      </div>

      <Discussions
        modelID={modelID}
        isOpen={isDiscussionOpen}
        closeModal={() => setIsDiscussionOpen(false)}
      />
      <DiscussionModalWrapper
        modelID={modelID}
        isOpen={isDiscussionOpen}
        closeModal={() => setIsDiscussionOpen(false)}
      />
    </div>
  );
};

export default ReadOnlyDiscussions;
