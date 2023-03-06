import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import '../index.scss';

const HIGLASTimeline = ({ solution }: { solution: HelpSolutionType }) => {
  return (
    <div className="line-height-body-5 font-body-md">
      <Trans i18nKey={`solutions.${solution.key}.timeline.description`}>
        Any necessary setup for HIGLAS will be taken care of when working with
        the Innovation Payment Contractor (IPC) or the Shared Systems. Contact
        Donna Schmidt at{' '}
        <Link
          aria-label="Open in a new tab"
          href="mailto:donna.schmidt@cms.hhs.gov"
          target="_blank"
          rel="noopener noreferrer"
        >
          donna.schmidt@cms.hhs.gov
        </Link>{' '}
        if you have questions.
      </Trans>
    </div>
  );
};

export default HIGLASTimeline;
