import React from 'react';
import { Trans } from 'react-i18next';

import ExternalLink from 'components/shared/ExternalLink';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import '../index.scss';

const HIGLASTimeline = ({ solution }: { solution: HelpSolutionType }) => {
  return (
    <div className="line-height-body-5 font-body-md">
      <Trans i18nKey={`solutions.${solution.key}.timeline.description`}>
        Any necessary setup for HIGLAS will be taken care of when working with
        the Innovation Payment Contractor (IPC) or the Shared Systems. Contact
        Donna Schmidt at{' '}
        <ExternalLink href="mailto:donna.schmidt@cms.hhs.gov">
          donna.schmidt@cms.hhs.gov
        </ExternalLink>{' '}
        if you have questions.
      </Trans>
    </div>
  );
};

export default HIGLASTimeline;
