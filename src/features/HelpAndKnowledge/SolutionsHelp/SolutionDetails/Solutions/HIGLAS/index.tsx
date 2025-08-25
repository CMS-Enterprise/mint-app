import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { timelineTranslationUtil } from 'features/HelpAndKnowledge/SolutionsHelp/util';

import { getTransLinkComponents } from '../Generic/About';

import '../index.scss';

const HIGLASTimeline = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig = timelineTranslationUtil(solution.key);

  return (
    <div className="line-height-body-5 font-body-md">
      <Trans
        i18nKey={`solutions.${solution.key}.timeline.description`}
        t={t}
        // @ts-ignore
        components={{
          ...getTransLinkComponents(timelineConfig.items[0].links)
        }}
      />
    </div>
  );
};

export default HIGLASTimeline;
