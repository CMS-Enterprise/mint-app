import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import OperationalSolutionCategories from 'data/operationalSolutionCategories';

import CategoryFooter from './_components/CategoryFooter';
import SolutionHelpCardGroup from './_components/SolutionHelpCardGroup';
import SolutionsHeader from './_components/SolutionsHeader';
import {
  helpSolutions,
  HelpSolutionType,
  operationalSolutionCategoryMap
} from './solutionsMap';

type OperationalSolutionsHelpProps = {
  className?: string;
};

export const findCategoryKey = (
  route: string
): OperationalSolutionCategories => {
  let categoryKey!: OperationalSolutionCategories;

  Object.keys(operationalSolutionCategoryMap).forEach(key => {
    if (
      operationalSolutionCategoryMap[key as OperationalSolutionCategories]
        .route === route
    ) {
      categoryKey = key as OperationalSolutionCategories;
    }
  });

  return categoryKey;
};

const findCategoryMapByRoute = (
  route: string,
  solutions: HelpSolutionType[]
): HelpSolutionType[] => {
  let filteredSolutions = { ...solutions };
  const categoryKey: OperationalSolutionCategories = findCategoryKey(route);

  filteredSolutions = solutions.filter(solution => {
    return solution.categories.includes(
      categoryKey as OperationalSolutionCategories
    );
  });
  return filteredSolutions;
};

const seachSolutions = (query: string): HelpSolutionType[] => {
  return helpSolutions.filter(
    solution =>
      solution.name.toLowerCase().includes(query.toLowerCase()) ||
      solution?.acronym?.toLowerCase().includes(query.toLowerCase())
  );
};

const SolutionsHelp = ({ className }: OperationalSolutionsHelpProps) => {
  const { category } = useParams<{ category: string }>();

  const { pathname } = useLocation();

  const [query, setQuery] = useState<string>('');
  const [resultsNum, setResultsNum] = useState<number>(0);

  const [querySolutions, setQuerySolutions] = useState<HelpSolutionType[]>(
    helpSolutions
  );

  useEffect(() => {
    setQuery('');
  }, [pathname, category]);

  useEffect(() => {
    if (query.trim()) {
      setQuerySolutions(seachSolutions(query));
    } else {
      setQuerySolutions(helpSolutions);
    }
  }, [query]);

  const solutions = category
    ? findCategoryMapByRoute(category, helpSolutions)
    : querySolutions;

  return (
    <div className={classNames(className)}>
      <SolutionsHeader
        resultsNum={resultsNum}
        resultsMax={solutions.length}
        setQuery={setQuery}
        query={query}
      />

      <SolutionHelpCardGroup
        solutions={solutions}
        setResultsNum={setResultsNum}
      />

      <GridContainer className="margin-top-4">
        <Divider className="margin-top-6" />

        <CategoryFooter />
      </GridContainer>
    </div>
  );
};

export default SolutionsHelp;
