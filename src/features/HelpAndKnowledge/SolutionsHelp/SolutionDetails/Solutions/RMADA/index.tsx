import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import ExternalLink from 'components/ExternalLink';

import '../index.scss';

const RMADATimeline = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div className="line-height-body-5 font-body-md">
      <Trans
        i18nKey={`solutions.${solution.key}.timeline.description`}
        t={t}
        components={{
          link1: (
            <ExternalLink href="https://agx.cms.gov/FirstVisitPage/GovernmentAgreement.aspx?ReturnUrl=http%3a%2f%2fagx.cms.gov%2fLibraries%2fLibrary.aspx%3fSearchTerm%3dPALT">
              {' '}
            </ExternalLink>
          )
        }}
      />
    </div>
  );
};

export default RMADATimeline;
