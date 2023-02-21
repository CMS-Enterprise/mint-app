import React from 'react';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { HelpSolutionType } from '../../solutionsMap';
import SolutionHelpCard from '../SolutionHelpCard';

type SolutionHelpCardGroupProps = {
  className?: string;
  solutions: HelpSolutionType[];
};

const SolutionHelpCardGroup = ({
  className,
  solutions
}: SolutionHelpCardGroupProps) => {
  return (
    <GridContainer className={classNames(className, 'margin-top-4')}>
      <Grid row gap={2}>
        {solutions.map(solution => (
          <Grid tablet={{ col: 4 }} key={solution.key}>
            <SolutionHelpCard solution={solution} />
          </Grid>
        ))}
      </Grid>
    </GridContainer>
  );
};

export default SolutionHelpCardGroup;
