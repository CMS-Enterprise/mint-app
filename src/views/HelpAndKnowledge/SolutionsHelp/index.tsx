/*
Operational Solution portion of the MINT Help and Knowledge Center
Contains components for search, categories, and solutions cards
*/

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import OperationalSolutionCategories from 'data/operationalSolutionCategories';
import usePrevLocation from 'hooks/usePrevious';

import CategoryFooter from './_components/CategoryFooter';
import SolutionHelpCardGroup from './_components/SolutionHelpCardGroup';
import SolutionsHeader from './_components/SolutionsHeader';
import SolutionDetailsModal from './SolutionDetails/Modal';
import {
  helpSolutions,
  HelpSolutionType,
  operationalSolutionCategoryMap
} from './solutionsMap';

type OperationalSolutionsHelpProps = {
  className?: string;
};

// Return all solutions relevant to the current cateory
export const findCategoryMapByRoute = (
  route: string,
  solutions: HelpSolutionType[]
): HelpSolutionType[] => {
  const categoryKey: OperationalSolutionCategories | undefined =
    operationalSolutionCategoryMap[route];

  if (!categoryKey) return [];

  return [...solutions].filter(solution => {
    return solution.categories.includes(
      categoryKey as OperationalSolutionCategories
    );
  });
};

export const findSolutionByRoute = (
  route: string | null,
  solutions: HelpSolutionType[]
): HelpSolutionType | undefined => {
  if (!route) return undefined;
  return [...solutions].find(solution => solution.route === route);
};

// Query function to return solutions for matching name and acronym
export const searchSolutions = (
  query: string,
  solutions: HelpSolutionType[]
): HelpSolutionType[] => {
  return solutions.filter(
    solution =>
      solution.name.toLowerCase().includes(query.toLowerCase()) ||
      solution?.acronym?.toLowerCase().includes(query.toLowerCase())
  );
};

const SolutionsHelp = ({ className }: OperationalSolutionsHelpProps) => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const category = params.get('category');
  const solution = params.get('solution');
  const page = params.get('page');

  const prevLocation = usePrevLocation(location);
  const prevPathname = prevLocation?.pathname + (prevLocation?.search || '');

  const [query, setQuery] = useState<string>('');
  const [resultsNum, setResultsNum] = useState<number>(0);

  const [querySolutions, setQuerySolutions] = useState<HelpSolutionType[]>(
    helpSolutions
  );

  // Resets the query on route or category change
  // Also preserves the query/scroll when the modal is open/closed
  useEffect(() => {
    if (!page && location.pathname) {
      setQuery('');
      window.scrollTo(0, 0);
    }
  }, [page, location.pathname, category]);

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      setQuerySolutions(searchSolutions(query, helpSolutions));
    } else {
      setQuerySolutions(helpSolutions);
    }
  }, [query, solution]);

  // If viewing by category, render those solutions, otherwise render querySolutions
  const solutions = !category
    ? querySolutions
    : findCategoryMapByRoute(category, helpSolutions);

  // Solution to render in modal
  const selectedSolution = findSolutionByRoute(solution, helpSolutions);

  return (
    <div className={classNames(className)}>
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
        />
      )}

      <SolutionsHeader
        category={category}
        resultsNum={resultsNum}
        resultsMax={solutions.length}
        setQuery={setQuery}
        query={query}
      />

      <SolutionHelpCardGroup
        solutions={solutions}
        setResultsNum={setResultsNum}
        category={category}
      />

      <GridContainer className="margin-top-4">
        <Divider className="margin-top-6" />

        <CategoryFooter />
      </GridContainer>
    </div>
  );
};

export default SolutionsHelp;
