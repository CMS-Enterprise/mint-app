/*
Operational Solution portion of the MINT Help and Knowledge Center
Contains components for search, categories, and solutions cards
*/

import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import PageLoading from 'components/PageLoading';
import Divider from 'components/shared/Divider';
import {
  OperationalSolutionCategories,
  OperationalSolutionCategoryRoute
} from 'data/operationalSolutionCategories';
import useHelpSolution from 'hooks/useHelpSolutions';
import useModalSolutionState from 'hooks/useModalSolutionState';

import CategoryFooter from './_components/CategoryFooter';
import SolutionHelpCardGroup from './_components/SolutionHelpCardGroup';
import SolutionsHeader from './_components/SolutionsHeader';
import SolutionDetailsModal from './SolutionDetails/Modal';
import {
  HelpSolutionType,
  operationalSolutionCategoryMap
} from './solutionsMap';

type OperationalSolutionsHelpProps = {
  className?: string;
};

// Return all solutions relevant to the current cateory
export const findCategoryMapByRouteParam = (
  route: OperationalSolutionCategoryRoute,
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

export const findSolutionByRouteParam = (
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
  const queryRegex = new RegExp(query.toLowerCase());
  return solutions.filter(
    solution =>
      solution.name.toLowerCase().includes(query.toLowerCase()) ||
      solution?.acronym?.toLowerCase().includes(query.toLowerCase()) ||
      solution.categories.some(e => queryRegex.test(e.replace('-', ' ')))
  );
};

const SolutionsHelp = ({ className }: OperationalSolutionsHelpProps) => {
  const location = useLocation();
  const history = useHistory();

  const params = new URLSearchParams(location.search);

  const category = params.get('category') as OperationalSolutionCategoryRoute;
  const page = params.get('page');
  const modal = params.get('solution');

  if (!page) {
    params.set('page', '1');
    history.replace({
      search: params.toString()
    });
  }

  const { helpSolutions, loading } = useHelpSolution();

  // Get the solution map details from solution route param
  const { prevPathname, selectedSolution: solution } =
    useModalSolutionState(null);

  const [query, setQuery] = useState<string>('');
  const [resultsNum, setResultsNum] = useState<number>(0);

  const [querySolutions, setQuerySolutions] =
    useState<HelpSolutionType[]>(helpSolutions);

  const fromModal: boolean = prevPathname.includes('solution=');

  // Resets the query on route or category change
  // Also preserves the query/scroll when the modal is open/closed
  useEffect(() => {
    if (!page && location.pathname && (!category || (!modal && !fromModal))) {
      setQuery('');
      window.scrollTo(0, 0);
    }
    if (!query && !modal && !fromModal) {
      window.scrollTo(0, 0);
    }
  }, [page, location.pathname, category, modal, query, fromModal]);

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      setQuerySolutions(searchSolutions(query, helpSolutions));
    } else {
      setQuerySolutions(helpSolutions);
    }
  }, [query, solution, helpSolutions]);

  // If viewing by category, render those solutions, otherwise render querySolutions
  const solutions = !category
    ? querySolutions
    : findCategoryMapByRouteParam(category, helpSolutions);

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solution?.route || null,
    helpSolutions
  );

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className={classNames(className)}>
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute="/help-and-knowledge/operational-solutions"
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

        <CategoryFooter currentCategory={category} />
      </GridContainer>
    </div>
  );
};

export default SolutionsHelp;
