import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Icon, PrimaryNav, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { OperationalSolutionKey } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import {
  HelpSolutionBaseType,
  helpSolutions
} from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import ModelsBySolutionTable from 'views/Home/components/ModelsBySolutions/table';

import './index.scss';

const ModelsBySolutions = ({
  operationalSolutionKeys
}: {
  operationalSolutionKeys: OperationalSolutionKey[];
}) => {
  const { t: customHomeT } = useTranslation('customHome');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const orderedOperationalSolutionKeys = useMemo(() => {
    return [...operationalSolutionKeys].sort((a, b) =>
      (helpSolutions.find(sol => sol.enum === a)?.name || '').localeCompare(
        helpSolutions.find(sol => sol.enum === b)?.name || ''
      )
    );
  }, [operationalSolutionKeys]);

  const [
    isCurrentSolution,
    setIsCurrentSolution
  ] = useState<OperationalSolutionKey>(orderedOperationalSolutionKeys[0]);

  const getSolutionNameorAcronym = (solution?: HelpSolutionBaseType) => {
    if (!solution) return '';
    if (solution && solution.acronym && solution.acronym.length > 2) {
      return solution.acronym.toUpperCase();
    }
    return solution.name;
  };

  const solutionNavs = orderedOperationalSolutionKeys.map(solutionKey => (
    <button
      type="button"
      key={solutionKey}
      onClick={() => setIsCurrentSolution(solutionKey)}
      className={classNames('usa-nav__link margin-left-neg-2 margin-right-2', {
        'usa-current': isCurrentSolution === solutionKey
      })}
    >
      <span>
        {getSolutionNameorAcronym(
          helpSolutions.find(solution => solution.enum === solutionKey)
        )}
      </span>
    </button>
  ));

  if (operationalSolutionKeys.length === 0) {
    return (
      <Alert
        type="info"
        className="margin-top-4"
        heading={customHomeT(
          `settings.MODELS_BY_OPERATIONAL_SOLUTION.noResultsHeading`
        )}
      >
        <UswdsReactLink
          to={{
            pathname: '/homepage-settings/solutions',
            state: { fromHome: true }
          }}
          className="display-flex flex-align-center text-bold"
        >
          <span className="margin-right-1">
            {customHomeT(
              `settings.MODELS_BY_OPERATIONAL_SOLUTION.noResultsDescription`
            )}
          </span>
          <Icon.ArrowForward />
        </UswdsReactLink>
      </Alert>
    );
  }

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
        <div className="maxw-mobile-lg">
          <Select
            id="solutionKey"
            name="solutionKey"
            value={isCurrentSolution}
            onChange={e =>
              setIsCurrentSolution(
                e.currentTarget.value as OperationalSolutionKey
              )
            }
            className="margin-bottom-4 text-primary text-bold"
          >
            {orderedOperationalSolutionKeys.map(solution => {
              return (
                <option key={solution} value={solution}>
                  {getSolutionNameorAcronym(
                    helpSolutions.find(sol => sol.enum === solution)
                  )}
                </option>
              );
            })}
          </Select>
        </div>
      )}

      <ModelsBySolutionTable operationalSolutionKey={isCurrentSolution} />
    </div>
  );
};

export default ModelsBySolutions;
