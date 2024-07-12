import React, { useState } from 'react';
import { Header, PrimaryNav } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { OperationalSolutionKey } from 'gql/gen/graphql';

import ModelsBySolutionTable from 'components/ModelsBySolution/table';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { helpSolutions } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import './index.scss';

const ModelsBySolutions = ({
  operationalSolutionKeys
}: {
  operationalSolutionKeys: OperationalSolutionKey[];
}) => {
  const [expanded, setExpanded] = useState(false);

  const [isCurrent, setIsCurrent] = useState<OperationalSolutionKey>(
    operationalSolutionKeys[0]
  );

  const onClick = (): void => setExpanded(prvExpanded => !prvExpanded);

  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  const solutionNavs = operationalSolutionKeys.map(solutionKey => (
    <button
      type="button"
      key={solutionKey}
      onClick={() => setIsCurrent(solutionKey)}
      className={classNames('usa-nav__link margin-left-neg-2 margin-right-2', {
        'usa-current': isCurrent === solutionKey
      })}
    >
      <span>
        {helpSolutions.find(solution => solution.enum === solutionKey)?.acronym}
      </span>
    </button>
  ));

  return (
    <div className="models-by-solutions">
      <Header
        basic
        extended={expanded}
        className="margin-bottom-4 models-by-solutions__nav-container"
      >
        <div className="usa-nav-container padding-0">
          <PrimaryNav
            items={solutionNavs}
            mobileExpanded={expanded}
            onToggleMobileNav={onClick}
            className="flex-justify-start margin-0 padding-0"
          />
        </div>
      </Header>

      <ModelsBySolutionTable operationalSolutionKey={isCurrent} />
    </div>
  );
};

export default ModelsBySolutions;
