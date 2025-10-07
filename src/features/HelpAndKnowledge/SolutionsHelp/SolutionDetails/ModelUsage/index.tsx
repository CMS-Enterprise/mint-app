import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from '../../solutionsMap';
import GenericModelUsage from '../Solutions/Generic/ModelUsage';

export const ModelUsage = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  if (solution.components['model-usage']) {
    return solution.components['model-usage']({
      solution
    });
  }

  return (
    <div>
      <h2 className="margin-top-0">{t('navigation.model-usage')}</h2>
      <GenericModelUsage solution={solution} />
    </div>
  );
};

export default ModelUsage;
