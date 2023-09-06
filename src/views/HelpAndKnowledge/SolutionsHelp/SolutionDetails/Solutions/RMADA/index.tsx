import React from 'react';
import { Trans } from 'react-i18next';

import ExternalLink from 'components/shared/ExternalLink';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import '../index.scss';

const RMADATimeline = ({ solution }: { solution: HelpSolutionType }) => {
  return (
    <div className="line-height-body-5 font-body-md">
      <Trans i18nKey={`solutions.${solution.key}.timeline.description`}>
        Model teams should follow the{' '}
        <ExternalLink href="https://agx.cms.gov/FirstVisitPage/GovernmentAgreement.aspx?ReturnUrl=http%3a%2f%2fagx.cms.gov%2fLibraries%2fLibrary.aspx%3fSearchTerm%3dPALT">
          Procurement Administrative Lead Time (PALT)
        </ExternalLink>{' '}
        standards to determine when to being working with RMADA.
      </Trans>
    </div>
  );
};

export default RMADATimeline;
