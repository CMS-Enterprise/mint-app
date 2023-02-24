import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import OperationalSolutionCategories from 'data/operationalSolutionCategories';

import CategoryFooter from './_components/CategoryFooter';
import SolutionHelpCardGroup, {
  LocationSolutionProps
} from './_components/SolutionHelpCardGroup';
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

export const findCategoryKey = (
  route: string | undefined
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

export const findCategoryMapByRoute = (
  route: string,
  solutions: HelpSolutionType[]
): HelpSolutionType[] => {
  let filteredSolutions = [...solutions];
  const categoryKey: OperationalSolutionCategories = findCategoryKey(route);

  filteredSolutions = solutions.filter(solution => {
    return solution.categories.includes(
      categoryKey as OperationalSolutionCategories
    );
  });
  return filteredSolutions;
};

export const findSolutionByRoute = (
  route: string,
  solutions: HelpSolutionType[]
): HelpSolutionType | undefined => {
  const filteredSolutions = [...solutions];
  return filteredSolutions.find(solution => solution.route === route);
};

export const seachSolutions = (
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
  const { category, solution } = useParams<{
    category: string;
    solution: string;
  }>();

  const location: LocationSolutionProps = useLocation();

  const { pathname, state } = location;

  const [prevCategory, setPrevCategory] = useState<string | undefined>(
    solution ? state?.prev?.split('/')[4] : category
  );

  useEffect(() => {
    if (!solution) {
      setPrevCategory(category);
    }
  }, [pathname, category, solution]);

  const [query, setQuery] = useState<string>('');
  const [resultsNum, setResultsNum] = useState<number>(0);

  const [querySolutions, setQuerySolutions] = useState<HelpSolutionType[]>(
    helpSolutions
  );

  useEffect(() => {
    setQuery('');
  }, [pathname, prevCategory]);

  useEffect(() => {
    if (query.trim()) {
      setQuerySolutions(seachSolutions(query, helpSolutions));
    } else {
      setQuerySolutions(helpSolutions);
    }
  }, [query]);

  const solutions = prevCategory
    ? findCategoryMapByRoute(prevCategory, helpSolutions)
    : querySolutions;

  const selectedSolution = findSolutionByRoute(solution, helpSolutions);

  return (
    <div className={classNames(className)}>
      {selectedSolution && <SolutionDetailsModal solution={selectedSolution} />}

      <SolutionsHeader
        category={prevCategory}
        resultsNum={resultsNum}
        resultsMax={solutions.length}
        setQuery={setQuery}
        query={query}
      />

      <SolutionHelpCardGroup
        solutions={solutions}
        setResultsNum={setResultsNum}
        category={prevCategory}
        isQuery={!!query}
      />

      <GridContainer className="margin-top-4">
        <Divider className="margin-top-6" />

        <CategoryFooter />
      </GridContainer>
    </div>
  );
};

export default SolutionsHelp;
