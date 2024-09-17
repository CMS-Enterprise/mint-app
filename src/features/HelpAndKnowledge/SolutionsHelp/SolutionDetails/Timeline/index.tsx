import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from '../../solutionsMap';
import GenericTimeline from '../Solutions/Generic/timeline';

export const Timeline = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const SolutionTimeline = !solution.components.timeline ? (
    <GenericTimeline solution={solution} />
  ) : (
    solution.components.timeline({
      solution
    })
  );

  return (
    <div>
      <h2 className="margin-top-0">{t('navigation.timeline')}</h2>
      {SolutionTimeline}
    </div>
  );
};

export default Timeline;
