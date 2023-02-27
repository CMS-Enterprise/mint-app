import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

export const GenericTimeline = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <div>
      <p className="margin-top-0 text-pre-wrap ">
        {t(`solutions.centralizedDataExhange.timeline.description`)}
      </p>
    </div>
  );
};

export default GenericTimeline;
