import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from '../../solutionsMap';

export const PointsOfContact = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <div>
      <h2 className="margin-top-0">{t('navigation.points-of-contact')}</h2>
    </div>
  );
};

export default PointsOfContact;
