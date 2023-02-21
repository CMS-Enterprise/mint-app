import React from 'react';
import { useParams } from 'react-router-dom';
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

const findCategoryMapByRoute = (
  route: string,
  solutions: HelpSolutionType[]
): HelpSolutionType[] => {
  let filteredSolutions = { ...solutions };
  let categoryKey: OperationalSolutionCategories;

  Object.keys(operationalSolutionCategoryMap).forEach(key => {
    if (
      operationalSolutionCategoryMap[key as OperationalSolutionCategories]
        .route === route
    ) {
      categoryKey = key as OperationalSolutionCategories;
    }
  });

  filteredSolutions = solutions.filter(solution => {
    return solution.categories.includes(
      categoryKey as OperationalSolutionCategories
    );
  });
  return filteredSolutions;
};

const SolutionsHelp = ({ className }: OperationalSolutionsHelpProps) => {
  const { category } = useParams<{ category: string }>();

  let solutions = helpSolutions;

  if (category) {
    solutions = findCategoryMapByRoute(category, solutions);
  }

  return (
    <div className={classNames(className)}>
      <SolutionsHeader />

      <SolutionHelpCardGroup solutions={solutions} />

      <GridContainer className="margin-top-4">
        <Divider />

        <CategoryFooter />
      </GridContainer>
    </div>
  );
};

export default SolutionsHelp;
