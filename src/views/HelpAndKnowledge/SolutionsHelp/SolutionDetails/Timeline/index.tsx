import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from '../../solutionsMap';

export const Timeline = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <div>
      <h2 className="margin-top-0">{t('navigation.timeline')}</h2>
    </div>
  );
};

export default Timeline;
