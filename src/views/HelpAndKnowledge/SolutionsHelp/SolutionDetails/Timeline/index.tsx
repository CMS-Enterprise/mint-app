import React from 'react';
import { useTranslation } from 'react-i18next';

export const Timeline = () => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <div>
      <h2 className="margin-top-0">{t('navigation.timeline')}</h2>
    </div>
  );
};

export default Timeline;
