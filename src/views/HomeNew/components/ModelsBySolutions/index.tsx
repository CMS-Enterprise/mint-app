import React, { useState } from 'react';
import { Header, PrimaryNav, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { OperationalSolutionKey } from 'gql/gen/graphql';

import ModelsBySolutionTable from 'components/ModelsBySolution/table';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import {
  HelpSolutionBaseType,
  helpSolutions
} from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import './index.scss';

const ModelsBySolutions = ({
  operationalSolutionKeys
}: {
  operationalSolutionKeys: OperationalSolutionKey[];
}) => {
  const [isCurrent, setIsCurrent] = useState<OperationalSolutionKey>(
    operationalSolutionKeys[0]
  );

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const getSolutionNameorAcronym = (solution?: HelpSolutionBaseType) => {
    if (!solution) return '';
    if (solution && solution.acronym && solution.acronym.length > 2) {
      return solution.acronym.toUpperCase();
    }
    return solution.name;
  };

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
        {getSolutionNameorAcronym(
          helpSolutions.find(solution => solution.enum === solutionKey)
        )}
      </span>
    </button>
  ));

  return (
    <div className="models-by-solutions">
      {operationalSolutionKeys.length < 6 && (
        <Header
          basic
          extended={false}
          className="margin-bottom-4 models-by-solutions__nav-container"
        >
          <div className="usa-nav-container padding-0">
            <PrimaryNav
              items={solutionNavs}
              mobileExpanded={false}
              className="flex-justify-start margin-0 padding-0"
            />
          </div>
        </Header>
      )}

      {(isTablet || operationalSolutionKeys.length > 5) && (
        <Select
          id="solutionKey"
          name="solutionKey"
          value={isCurrent}
          onChange={e =>
            setIsCurrent(e.currentTarget.value as OperationalSolutionKey)
          }
          className="margin-bottom-4 text-primary text-bold"
        >
          {operationalSolutionKeys.map(solution => {
            return (
              <option key={solution} value={solution}>
                {getSolutionNameorAcronym(
                  helpSolutions.find(sol => sol.enum === solution)
                )}
              </option>
            );
          })}
        </Select>
      )}

      <ModelsBySolutionTable operationalSolutionKey={isCurrent} />
    </div>
  );
};

export default ModelsBySolutions;
