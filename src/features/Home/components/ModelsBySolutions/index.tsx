import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Icon, PrimaryNav, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  HelpSolutionBaseType,
  helpSolutions,
  helpSolutionsArray
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import ModelsBySolutionTable from 'features/Home/components/ModelsBySolutions/table';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import './index.scss';

const ModelsBySolutions = ({
  solutionKeys
}: {
  solutionKeys: MtoCommonSolutionKey[];
}) => {
  const { t: customHomeT } = useTranslation('customHome');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const orderedsolutionKeys = useMemo(() => {
    return [...solutionKeys].sort((a, b) =>
      (helpSolutionsArray.find(sol => sol.key === a)?.name || '').localeCompare(
        helpSolutionsArray.find(sol => sol.key === b)?.name || ''
      )
    );
  }, [solutionKeys]);

  const [isCurrentSolution, setIsCurrentSolution] =
    useState<MtoCommonSolutionKey>(orderedsolutionKeys[0]);

  const getSolutionNameorAcronym = (solution?: HelpSolutionBaseType) => {
    if (!solution) return '';
    if (solution && solution.acronym && solution.acronym.length > 2) {
      return solution.acronym.toUpperCase();
    }
    return solution.name;
  };

  const solutionNavs = orderedsolutionKeys.map(solutionKey => (
    <button
      type="button"
      key={solutionKey}
      onClick={() => setIsCurrentSolution(solutionKey)}
      className={classNames('usa-nav__link margin-left-neg-2 margin-right-2', {
        'usa-current': isCurrentSolution === solutionKey
      })}
    >
      <span>{getSolutionNameorAcronym(helpSolutions[solutionKey])}</span>
    </button>
  ));

  if (solutionKeys.length === 0) {
    return (
      <Alert
        type="info"
        className="margin-top-4"
        heading={customHomeT(`settings.MODELS_BY_SOLUTION.noResultsHeading`)}
      >
        <UswdsReactLink
          to="/homepage-settings/solutions"
          state={{ fromHome: true }}
          className="display-flex flex-align-center text-bold"
        >
          <span className="margin-right-1">
            {customHomeT(`settings.MODELS_BY_SOLUTION.noResultsDescription`)}
          </span>
          <Icon.ArrowForward aria-label="forward" />
        </UswdsReactLink>
      </Alert>
    );
  }

  return (
    <div className="models-by-solutions">
      {solutionKeys.length < 6 && (
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

      {(isTablet || solutionKeys.length > 5) && (
        <div className="maxw-mobile-lg">
          <Select
            id="solutionKey"
            name="solutionKey"
            value={isCurrentSolution}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setIsCurrentSolution(
                e.currentTarget.value as MtoCommonSolutionKey
              )
            }
            className="margin-bottom-4 text-primary text-bold"
          >
            {orderedsolutionKeys.map(solution => {
              return (
                <option key={solution} value={solution}>
                  {getSolutionNameorAcronym(helpSolutions[solution])}
                </option>
              );
            })}
          </Select>
        </div>
      )}

      <ModelsBySolutionTable solutionKey={isCurrentSolution} />
    </div>
  );
};

export default ModelsBySolutions;
