import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from '../../solutionsMap';
import GenericPointsOfContact from '../Solutions/Generic/pointsOfContact';

export const PointsOfContact = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  const SolutionPointsOfContact = !solution.components['points-of-contact'] ? (
    <GenericPointsOfContact solution={solution} />
  ) : (
    solution.components['points-of-contact']({
      solution
    })
  );

  return (
    <div>
      <h2 className="margin-top-0">{t('navigation.points-of-contact')}</h2>
      {SolutionPointsOfContact}
    </div>
  );
};

export default PointsOfContact;
