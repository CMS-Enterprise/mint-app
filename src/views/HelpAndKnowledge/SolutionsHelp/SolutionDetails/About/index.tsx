import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from '../../solutionsMap';
import GenericAbout from '../Solutions/Generic/about';

export const About = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const SolutionAbout = solution.generic.about ? (
    <GenericAbout solution={solution} />
  ) : (
    solution?.component({
      type: 'about',
      solution
    })
  );

  return (
    <div>
      <h2 className="margin-top-0">{t('navigation.about')}</h2>
      {SolutionAbout}
    </div>
  );
};

export default About;
