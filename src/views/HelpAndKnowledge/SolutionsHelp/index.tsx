import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import OperationalSolutionCategories from 'data/operationalSolutionCategories';

import CategoryFooter from './_components/CategoryFooter';
import SolutionHelpCard from './_components/SolutionHelpCard';
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
      <GridContainer className="margin-top-4">
        <Grid row gap={2}>
          {solutions.map(solution => (
            <Grid tablet={{ col: 4 }} key={solution.key}>
              <SolutionHelpCard solution={solution} />
            </Grid>
          ))}
        </Grid>
        <Divider />
        <CategoryFooter />
      </GridContainer>
    </div>
  );
};

export default SolutionsHelp;
