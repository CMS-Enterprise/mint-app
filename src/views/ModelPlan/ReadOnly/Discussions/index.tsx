import React from 'react';
import { useTranslation } from 'react-i18next';

const ReadOnlyDiscussions = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('discussions');

  return (
    <div
      className="read-only-model-plan--discussions"
      data-testid="read-only-model-plan--discussions"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
      </div>
    </div>
  );
};

export default ReadOnlyDiscussions;
